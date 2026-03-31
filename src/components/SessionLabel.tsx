import { useTimerStore } from '../stores/timerStore'

export function SessionLabel() {
  const { state, sessionType, sessionCount } = useTimerStore()

  let label = ''
  if (state === 'idle') {
    label = 'Ready to focus'
  } else if (state === 'completed') {
    label = sessionType === 'focus' ? 'Session complete!' : 'Break over!'
  } else if (sessionType === 'focus') {
    label = `Focus #${sessionCount + 1}`
  } else if (sessionType === 'shortBreak') {
    label = 'Short Break'
  } else {
    label = 'Long Break'
  }

  const isBreak = sessionType !== 'focus' && state !== 'idle'

  return (
    <p
      className="font-heading font-semibold text-sm tracking-wide uppercase"
      style={{ color: isBreak ? 'var(--color-break-accent)' : 'var(--color-accent)' }}
      aria-live="polite"
    >
      {label}
    </p>
  )
}
