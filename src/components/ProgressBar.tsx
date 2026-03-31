import { useMemo } from 'react'
import { useSessionStore, getTodayCompleted } from '../stores/sessionStore'
import { useSettingsStore } from '../stores/settingsStore'

export function ProgressBar() {
  const dayData = useSessionStore((s) => s.dayData)
  const dailyTarget = useSettingsStore((s) => s.dailyTarget)
  const todayCompleted = useMemo(() => getTodayCompleted(dayData), [dayData])

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-heading font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
          Today
        </span>
        <span className="text-xs tabular-nums" style={{ color: 'var(--color-text-tertiary)' }}>
          {todayCompleted}/{dailyTarget}
        </span>
      </div>
      <div className="flex gap-1.5" role="progressbar" aria-valuenow={todayCompleted} aria-valuemax={dailyTarget}>
        {Array.from({ length: dailyTarget }, (_, i) => (
          <div
            key={i}
            className="h-2 flex-1 rounded-full transition-colors duration-300"
            style={{
              background: i < todayCompleted ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
              boxShadow: i < todayCompleted ? '0 0 8px var(--color-accent-glow)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}
