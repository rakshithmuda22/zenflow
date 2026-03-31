import { useSettingsStore } from '../stores/settingsStore'
import { useTimerStore } from '../stores/timerStore'

interface SettingsProps {
  onClose: () => void
}

function DurationInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const minutes = Math.floor(value / 60)
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(60, value - 60))}
          className="btn-press w-7 h-7 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="text-sm font-heading font-semibold w-8 text-center tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
          {minutes}m
        </span>
        <button
          onClick={() => onChange(Math.min(3600, value + 60))}
          className="btn-press w-7 h-7 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        className="btn-press w-10 h-5 rounded-full relative transition-colors"
        style={{ background: value ? 'var(--color-accent)' : 'var(--color-bg-tertiary)' }}
        aria-label={`${label}: ${value ? 'enabled' : 'disabled'}`}
      >
        <div
          className="w-4 h-4 rounded-full absolute top-0.5 transition-all"
          style={{ background: '#fff', left: value ? '22px' : '2px' }}
        />
      </button>
    </div>
  )
}

export function Settings({ onClose }: SettingsProps) {
  const settings = useSettingsStore()
  const syncIdleDuration = useTimerStore((s) => s.syncIdleDuration)

  const handleSave = () => {
    syncIdleDuration(settings.focusDuration)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center safe-area-pad"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleSave() }}
    >
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto fade-enter"
        style={{ background: 'var(--color-bg-secondary)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--color-text-primary)' }}>
            Settings
          </h2>
          <button
            onClick={handleSave}
            className="btn-press w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div className="space-y-1" style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
          <p className="text-xs font-heading font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
            Durations
          </p>
          <DurationInput label="Focus" value={settings.focusDuration} onChange={(v) => settings.update({ focusDuration: v })} />
          <DurationInput label="Short Break" value={settings.shortBreakDuration} onChange={(v) => settings.update({ shortBreakDuration: v })} />
          <DurationInput label="Long Break" value={settings.longBreakDuration} onChange={(v) => settings.update({ longBreakDuration: v })} />
        </div>

        <div className="space-y-1 mt-4 pt-4" style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
          <p className="text-xs font-heading font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
            Behavior
          </p>
          <Toggle label="Auto-start breaks" value={settings.autoStartBreaks} onChange={(v) => settings.update({ autoStartBreaks: v })} />
          <Toggle label="Auto-start focus" value={settings.autoStartFocus} onChange={(v) => settings.update({ autoStartFocus: v })} />
          <Toggle label="Commitment prompt" value={settings.showCommitment} onChange={(v) => settings.update({ showCommitment: v })} />
        </div>

        <div className="mt-4 pt-4" style={{ borderBottom: '1px solid var(--color-surface-border)' }}>
          <p className="text-xs font-heading font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
            Daily Target
          </p>
          <div className="flex items-center gap-2 py-2">
            <button
              onClick={() => settings.update({ dailyTarget: Math.max(1, settings.dailyTarget - 1) })}
              className="btn-press w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}
              aria-label="Decrease daily target"
            >
              −
            </button>
            <span className="text-sm font-heading font-semibold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
              {settings.dailyTarget} pomodoros
            </span>
            <button
              onClick={() => settings.update({ dailyTarget: Math.min(20, settings.dailyTarget + 1) })}
              className="btn-press w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}
              aria-label="Increase daily target"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4">
          <p className="text-xs font-heading font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
            Focus Mantra
          </p>
          <input
            type="text"
            value={settings.focusMantra}
            onChange={(e) => settings.update({ focusMantra: e.target.value })}
            className="w-full rounded-xl px-3 py-2 text-sm outline-none"
            style={{
              background: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-surface-border)',
            }}
            aria-label="Focus mantra text"
          />
        </div>

        <button
          onClick={handleSave}
          className="btn-press w-full mt-6 py-3 rounded-2xl font-heading font-semibold text-sm"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
          aria-label="Save settings"
        >
          Save
        </button>
      </div>
    </div>
  )
}
