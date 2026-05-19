import { useState, useEffect } from 'react'

const FALLBACK = { hh: '00', mm: '45', ss: '00', matchName: 'Next Match' }
const API_URL =
  'https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328'

function pad(n) {
  return String(n).padStart(2, '0')
}

function computeCountdown(targetMs) {
  const diff = Math.max(0, targetMs - Date.now())
  const totalSecs = Math.floor(diff / 1000)
  const hh = pad(Math.floor(totalSecs / 3600))
  const mm = pad(Math.floor((totalSecs % 3600) / 60))
  const ss = pad(totalSecs % 60)
  return { hh, mm, ss }
}

/**
 * Fetches the next Premier League fixture from TheSportsDB and returns
 * a live countdown { hh, mm, ss, matchName } that ticks every second.
 * Falls back to a static 00:45:00 if the API is unavailable.
 */
export function useNextKickoff() {
  const [countdown, setCountdown] = useState(FALLBACK)

  useEffect(() => {
    let intervalId = null
    let targetMs = null

    async function fetchNext() {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        const events = data.events
        if (!events || events.length === 0) throw new Error('No events')

        const next = events[0]
        // strTimestamp is like "2026-05-18T15:00:00+00:00"
        const raw = next.strTimestamp || next.dateEvent + 'T' + next.strTime + '+00:00'
        targetMs = new Date(raw).getTime()

        const matchName = `${next.strHomeTeam} vs ${next.strAwayTeam}`

        function tick() {
          const cd = computeCountdown(targetMs)
          setCountdown({ ...cd, matchName })
        }

        tick()
        intervalId = setInterval(tick, 1000)
      } catch {
        // Fallback: countdown from a static 45-minute offset
        targetMs = Date.now() + 45 * 60 * 1000

        function tick() {
          const cd = computeCountdown(targetMs)
          setCountdown({ ...cd, matchName: 'Next Premier League Match' })
        }

        tick()
        intervalId = setInterval(tick, 1000)
      }
    }

    fetchNext()
    return () => clearInterval(intervalId)
  }, [])

  return countdown
}
