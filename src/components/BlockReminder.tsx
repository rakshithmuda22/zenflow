import { useState } from 'react'
import { useSettingsStore } from '../stores/settingsStore'

interface BlockReminderProps {
  onDismiss: () => void
}

export function BlockReminder({ onDismiss }: BlockReminderProps) {
  const { blockList } = useSettingsStore()
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div
      className="rounded-2xl p-4 mb-4 fade-enter"
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-surface-border)',
      }}
    >
      <p className="text-sm font-heading font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
        Time to focus!
      </p>
      <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
        Consider closing: {blockList.join(', ')}
      </p>
      <button
        onClick={() => { setVisible(false); onDismiss() }}
        className="btn-press text-xs px-4 py-1.5 rounded-lg font-heading font-semibold"
        style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}
        aria-label="Dismiss reminder"
      >
        Got it
      </button>
    </div>
  )
}
