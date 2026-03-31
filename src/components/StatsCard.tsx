import { useMemo } from 'react'
import {
  useSessionStore,
  getTodayFocusMinutes,
  getAllTimeFocusMinutes,
  getCompletionRate,
  getAvgSessionMinutes,
  getStreak,
} from '../stores/sessionStore'

export function StatsCard() {
  const dayData = useSessionStore((s) => s.dayData)
  const sessions = useSessionStore((s) => s.sessions)

  const todayMinutes = useMemo(() => getTodayFocusMinutes(dayData), [dayData])
  const allTimeMinutes = useMemo(() => getAllTimeFocusMinutes(dayData), [dayData])
  const completionRate = useMemo(() => getCompletionRate(sessions), [sessions])
  const avgSession = useMemo(() => getAvgSessionMinutes(sessions), [sessions])
  const streakCount = useMemo(() => getStreak(dayData), [dayData])

  const stats = [
    { label: 'Today', value: `${todayMinutes}m` },
    { label: 'All Time', value: allTimeMinutes >= 60 ? `${Math.floor(allTimeMinutes / 60)}h ${allTimeMinutes % 60}m` : `${allTimeMinutes}m` },
    { label: 'Avg Session', value: `${avgSession}m` },
    { label: 'Completion', value: `${completionRate}%` },
  ]

  return (
    <div>
      {streakCount > 0 && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-sm">🔥</span>
          <span className="text-xs font-heading font-semibold" style={{ color: 'var(--color-accent)' }}>
            {streakCount} day streak
          </span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl px-3 py-2.5"
            style={{ background: 'var(--color-bg-tertiary)' }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
              {s.label}
            </p>
            <p className="text-lg font-heading font-bold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
