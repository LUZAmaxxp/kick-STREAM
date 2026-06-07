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

export function useNextKickoff() {
  const [countdown, setCountdown] = useState(FALLBACK)

  useEffect(() => {
    let intervalId = null
    let cancelled = false
    let targetMs = Date.now() + 45 * 60 * 1000
    let matchName = 'Next Major Event'

    const tick = () => {
      if (cancelled) return
      const cd = computeCountdown(targetMs)
      setCountdown({ ...cd, matchName })
    }

    const start = () => {
      tick()
      intervalId = setInterval(tick, 1000)
    }

    ;(async () => {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error('API error')
        const data = await res.json()
        const events = data.events
        if (!events || events.length === 0) throw new Error('No events')
        const next = events[0]
        const raw = next.strTimestamp || next.dateEvent + 'T' + next.strTime + '+00:00'
        targetMs = new Date(raw).getTime()
        matchName = `${next.strHomeTeam} vs ${next.strAwayTeam}`
      } catch {
        // keep fallback values
      }
      start()
    })()

    return () => {
      cancelled = true
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  return countdown
}
