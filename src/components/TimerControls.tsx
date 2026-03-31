import { useState } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useSettingsStore } from '../stores/settingsStore'

export function TimerControls() {
  const { state, startFocus, startBreak, pause, resume, skip, reset, sessionType } = useTimer()
  const { showCommitment } = useSettingsStore()
  const [committed, setCommitted] = useState(false)

  const isIdle = state === 'idle'
  const isPaused = state === 'paused'
  const isCompleted = state === 'completed'
  const isRunning = state === 'running' || state === 'break' || state === 'longBreak'

  const handleStartFocus = () => {
    if (showCommitment && !committed) {
      setCommitted(true)
      return
    }
    setCommitted(false)
    startFocus()
  }

  if (isIdle) {
    if (showCommitment && !committed) {
      return (
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleStartFocus}
            className="btn-press px-8 py-3.5 rounded-2xl font-heading font-semibold text-base transition-all"
            style={{
              background: 'var(--color-accent)',
              color: '#fff',
              boxShadow: '0 0 30px var(--color-accent-glow)',
            }}
            aria-label="Commit to focus session"
          >
            I commit to focus
          </button>
          <button
            onClick={() => { setCommitted(true); handleStartFocus() }}
            className="text-xs"
            style={{ color: 'var(--color-text-tertiary)' }}
            aria-label="Skip commitment and start"
          >
            Skip &amp; start
          </button>
        </div>
      )
    }

    return (
      <button
        onClick={handleStartFocus}
        className="btn-press px-8 py-3.5 rounded-2xl font-heading font-semibold text-base transition-all"
        style={{
          background: 'var(--color-accent)',
          color: '#fff',
          boxShadow: '0 0 30px var(--color-accent-glow)',
        }}
        aria-label="Start focus session"
      >
        Start Focus
      </button>
    )
  }

  if (isCompleted) {
    return (
      <div className="flex gap-3">
        {sessionType === 'focus' ? (
          <button
            onClick={startBreak}
            className="btn-press px-6 py-3 rounded-2xl font-heading font-semibold text-sm"
            style={{ background: 'var(--color-break-accent)', color: '#0A0A0F' }}
            aria-label="Start break"
          >
            Take a Break
          </button>
        ) : (
          <button
            onClick={() => { setCommitted(false); startFocus() }}
            className="btn-press px-6 py-3 rounded-2xl font-heading font-semibold text-sm"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
            aria-label="Start focus session"
          >
            Start Focus
          </button>
        )}
        <button
          onClick={reset}
          className="btn-press px-4 py-3 rounded-2xl font-heading font-semibold text-sm"
          style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}
          aria-label="Reset timer"
        >
          Reset
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      {isRunning && (
        <button
          onClick={pause}
          className="btn-press px-6 py-3 rounded-2xl font-heading font-semibold text-sm"
          style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-primary)' }}
          aria-label="Pause timer"
        >
          Pause
        </button>
      )}
      {isPaused && (
        <button
          onClick={resume}
          className="btn-press px-6 py-3 rounded-2xl font-heading font-semibold text-sm"
          style={{
            background: sessionType === 'focus' ? 'var(--color-accent)' : 'var(--color-break-accent)',
            color: sessionType === 'focus' ? '#fff' : '#0A0A0F',
          }}
          aria-label="Resume timer"
        >
          Resume
        </button>
      )}
      <button
        onClick={skip}
        className="btn-press px-4 py-3 rounded-2xl font-heading font-semibold text-sm"
        style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-tertiary)' }}
        aria-label="Skip session"
      >
        Skip
      </button>
    </div>
  )
}
