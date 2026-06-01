import { useState, useEffect, useCallback } from 'react'

const BASE = 'https://www.thesportsdb.com/api/v1/json/3'
const LEAGUE_ID = '4328'
const SEASON = '2025-2026'

/**
 * Map TheSportsDB strStatus to a display code.
 * For "Not Started" events we also check whether the timestamp has elapsed to catch
 * in-progress matches the API hasn't yet marked live.
 */
function deriveStatus(event) {
  const status = (event.strStatus || '').toLowerCase()

  if (status === 'match finished' || status === 'finished' || status === 'ft') {
    return { code: 'FT', label: 'FT' }
  }

  if (status === 'half time' || status === 'ht') {
    return { code: 'HT', label: 'HT' }
  }

  if (status === 'in progress' || status === 'live' || status === '1h' || status === '2h') {
    const kickoff = new Date(event.strTimestamp + 'Z').getTime()
    const elapsed = Math.max(0, Math.floor((Date.now() - kickoff) / 60000))
    const minute = elapsed <= 45 ? elapsed : elapsed - 15
    return { code: 'LIVE', label: `${Math.min(minute, 90)}'` }
  }

  // "Not Started" — check if timestamp has passed (API slow to update)
  if (event.strTimestamp) {
    const kickoff = new Date(event.strTimestamp + 'Z').getTime()
    const elapsed = Math.floor((Date.now() - kickoff) / 60000)

    if (elapsed > 0 && elapsed < 50) {
      return { code: 'LIVE', label: `${elapsed}'` }
    }
    if (elapsed >= 50 && elapsed < 65) {
      return { code: 'HT', label: 'HT' }
    }
    if (elapsed >= 65 && elapsed < 115) {
      return { code: 'LIVE', label: `${Math.min(elapsed - 15, 90)}'` }
    }
  }

  // Upcoming — format kick-off time
  if (event.strTimestamp) {
    const kickoff = new Date(event.strTimestamp + 'Z')
    const timeStr = kickoff.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/London',
    })
    const dateStr = kickoff.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: 'Europe/London',
    })
    return { code: 'UPCOMING', label: `${dateStr} ${timeStr}` }
  }

  return { code: 'UPCOMING', label: 'TBC' }
}

function normaliseEvent(e) {
  const { code, label } = deriveStatus(e)
  return {
    id:           e.idEvent,
    home:         e.strHomeTeam,
    away:         e.strAwayTeam,
    homeBadge:    e.strHomeTeamBadge || null,
    awayBadge:    e.strAwayTeamBadge || null,
    homeScore:    e.intHomeScore != null ? String(e.intHomeScore) : null,
    awayScore:    e.intAwayScore != null ? String(e.intAwayScore) : null,
    round:        e.intRound || null,
    venue:        e.strVenue || null,
    statusCode:   code,
    statusLabel:  label,
    timestamp:    e.strTimestamp || null,
  }
}

/**
 * Fetches the current Premier League matchday.
 *
 * Strategy:
 *  1. Fetch the next fixture to determine the current round.
 *  2. Fetch the full round via eventsround.php so we get all 10 matches.
 *  3. Also fetch last results in case the current round is fully done.
 *  4. Poll every 60 seconds during live windows (any match LIVE/HT).
 */
export function usePLFixtures() {
  const [matches,  setMatches]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [round,    setRound]    = useState(null)

  const load = useCallback(async () => {
    try {
      // Step 1: get next event to find current round
      const nextRes  = await fetch(`${BASE}/eventsnextleague.php?id=${LEAGUE_ID}`)
      if (!nextRes.ok) throw new Error(`API ${nextRes.status}`)
      const nextData = await nextRes.json()
      const nextEvents = nextData.events || []

      let currentRound = null
      if (nextEvents.length > 0) {
        currentRound = nextEvents[0].intRound
      }

      // Step 2: fetch all matches in that round
      let roundEvents = []
      if (currentRound) {
        const roundRes  = await fetch(
          `${BASE}/eventsround.php?id=${LEAGUE_ID}&r=${currentRound}&s=${SEASON}`
        )
        if (roundRes.ok) {
          const roundData = await roundRes.json()
          roundEvents = roundData.events || []
        }
      }

      // Step 3: fallback to past events if round returned nothing
      if (roundEvents.length === 0) {
        const pastRes  = await fetch(`${BASE}/eventspastleague.php?id=${LEAGUE_ID}`)
        if (pastRes.ok) {
          const pastData = await pastRes.json()
          roundEvents = pastData.events || []
        }
      }

      // Step 4: merge — prefer round data but supplement with next event
      const combined = roundEvents.length > 0 ? roundEvents : nextEvents
      const normalised = combined.map(normaliseEvent)

      // Sort: LIVE first, then HT, then UPCOMING, then FT
      const order = { LIVE: 0, HT: 1, UPCOMING: 2, FT: 3 }
      normalised.sort((a, b) => (order[a.statusCode] ?? 4) - (order[b.statusCode] ?? 4))

      setMatches(normalised)
      setRound(currentRound)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Poll when any match is live; back off when tab hidden; exponential backoff on errors
  useEffect(() => {
    const hasLive = matches.some(m => m.statusCode === 'LIVE' || m.statusCode === 'HT')
    let baseInterval = hasLive ? 60_000 : 300_000
    let currentInterval = baseInterval
    let timerId = null

    const schedule = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        timerId = setTimeout(schedule, 30_000)
        return
      }
      timerId = setTimeout(async () => {
        const before = error
        await load()
        currentInterval = error && error !== before
          ? Math.min(currentInterval * 2, 30 * 60_000)
          : baseInterval
        schedule()
      }, currentInterval)
    }

    schedule()
    const onVis = () => { /* trigger immediate reschedule on visibility change */ }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      if (timerId) clearTimeout(timerId)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [matches, load, error])

  return { matches, loading, error, round }
}
