import { useMemo } from 'react'
import { useSessionStore, getWeekData } from '../stores/sessionStore'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getIntensity(minutes: number): string {
  if (minutes === 0) return 'var(--color-bg-tertiary)'
  if (minutes < 30) return 'var(--color-accent-soft)'
  if (minutes < 60) return 'var(--color-accent-glow)'
  if (minutes < 120) return 'var(--color-accent)'
  return 'var(--color-accent)'
}

function getOpacity(minutes: number): number {
  if (minutes === 0) return 1
  if (minutes < 30) return 0.4
  if (minutes < 60) return 0.6
  if (minutes < 120) return 0.8
  return 1
}

export function WeeklyHeatmap() {
  const dayData = useSessionStore((s) => s.dayData)
  const weekData = useMemo(() => getWeekData(dayData), [dayData])

  return (
    <div>
      <h3 className="text-xs font-heading font-semibold mb-3" style={{ color: 'var(--color-text-secondary)' }}>
        This Week
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {weekData.map((day) => {
          const dow = new Date(day.date + 'T12:00:00').getDay()
          const dayLabel = DAYS[dow === 0 ? 6 : dow - 1]
          return (
            <div key={day.date} className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] tabular-nums font-medium transition-all"
                style={{
                  background: getIntensity(day.focusMinutes),
                  opacity: getOpacity(day.focusMinutes),
                  color: day.focusMinutes > 30 ? '#fff' : 'var(--color-text-tertiary)',
                }}
                aria-label={`${dayLabel}: ${day.focusMinutes} minutes focused`}
              >
                {day.focusMinutes > 0 ? `${day.focusMinutes}m` : ''}
              </div>
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                {dayLabel}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
