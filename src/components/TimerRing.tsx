import { useTimerStore } from '../stores/timerStore'

const SIZE = 280
const STROKE = 8
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function TimerRing() {
  const { remainingSeconds, totalSeconds, state, sessionType } = useTimerStore()

  const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 1
  const offset = CIRCUMFERENCE * (1 - progress)
  const isBreak = sessionType !== 'focus'
  const accentColor = isBreak ? 'var(--color-break-accent)' : 'var(--color-accent)'
  const glowColor = isBreak ? 'var(--color-break-glow)' : 'var(--color-accent-glow)'
  const isActive = state === 'running' || state === 'break' || state === 'longBreak'

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      {/* Breathing pulse behind ring */}
      {isActive && state === 'running' && (
        <div
          className="absolute inset-0 rounded-full animate-breathe"
          style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
        />
      )}

      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={isActive ? 'animate-ring-glow' : ''}
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-ring-bg)"
          strokeWidth={STROKE}
        />
        {/* Progress arc */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={accentColor}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{ transition: 'stroke-dashoffset 0.3s linear' }}
        />
      </svg>

      {/* Time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-heading font-bold tracking-[-0.03em] tabular-nums"
          style={{ fontSize: '3.5rem', lineHeight: 1, color: 'var(--color-text-primary)' }}
          aria-label={`${minutes} minutes ${seconds} seconds remaining`}
        >
          {timeStr}
        </span>
      </div>
    </div>
  )
}
