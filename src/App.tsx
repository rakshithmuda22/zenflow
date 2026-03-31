import { useEffect, useState } from 'react'
import { useTimerStore } from './stores/timerStore'
import { useSettingsStore } from './stores/settingsStore'
import { useSessionStore } from './stores/sessionStore'
import { useTaskStore } from './stores/taskStore'
import { useSound } from './hooks/useSound'
import { useOrientation } from './hooks/useOrientation'
import { TimerRing } from './components/TimerRing'
import { TimerControls } from './components/TimerControls'
import { SessionLabel } from './components/SessionLabel'
import { ProgressBar } from './components/ProgressBar'
import { WeeklyHeatmap } from './components/WeeklyHeatmap'
import { StatsCard } from './components/StatsCard'
import { TaskList } from './components/TaskList'
import { AmbientToggle } from './components/AmbientToggle'
import { FocusMode } from './components/FocusMode'
import { BlockReminder } from './components/BlockReminder'
import { Settings } from './components/Settings'
import { ThemeToggle } from './components/ThemeToggle'
import { usePiP } from './hooks/usePiP'

type View = 'timer' | 'stats'

export default function App() {
  const [view, setView] = useState<View>('timer')
  const [showSettings, setShowSettings] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [showBlockReminder, setShowBlockReminder] = useState(false)

  const timerState = useTimerStore((s) => s.state)
  const sessionType = useTimerStore((s) => s.sessionType)
  const settingsInit = useSettingsStore((s) => s.initialized)
  const initSettings = useSettingsStore((s) => s.init)
  const initSessions = useSessionStore((s) => s.init)
  const initTasks = useTaskStore((s) => s.init)

  const isLandscape = useOrientation()
  const { openPiP, isSupported: pipSupported } = usePiP()
  useSound()

  useEffect(() => {
    initSettings()
    initSessions()
    initTasks()
  }, [initSettings, initSessions, initTasks])

  useEffect(() => {
    if (timerState === 'running' && sessionType === 'focus') {
      setShowBlockReminder(true)
    }
  }, [timerState, sessionType])

  if (!settingsInit) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (focusMode) {
    return <FocusMode onExit={() => setFocusMode(false)} />
  }

  const isActive = timerState === 'running' || timerState === 'break' || timerState === 'longBreak' || timerState === 'paused'

  return (
    <div
      className="h-full flex flex-col safe-area-pad"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-3 pb-2 flex-shrink-0">
        <h1
          className="font-heading font-bold text-lg tracking-[-0.03em]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          ZenFlow
        </h1>
        <div className="flex items-center gap-2">
          {isActive && (
            <>
              {pipSupported && (
                <button
                  onClick={openPiP}
                  className="btn-press w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--color-bg-tertiary)' }}
                  aria-label="Open floating timer widget"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <rect x="12" y="9" width="8" height="6" rx="1" fill="var(--color-accent)" stroke="none" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setFocusMode(true)}
                className="btn-press px-3 py-1.5 rounded-lg text-xs font-heading font-semibold"
                style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}
                aria-label="Enter focus mode"
              >
                Immerse
              </button>
            </>
          )}
          <ThemeToggle />
          <button
            onClick={() => setShowSettings(true)}
            className="btn-press w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-bg-tertiary)' }}
            aria-label="Open settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round">
              <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <nav className="flex px-5 gap-1 flex-shrink-0">
        {(['timer', 'stats'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className="btn-press px-4 py-1.5 rounded-lg text-xs font-heading font-semibold capitalize transition-colors"
            style={{
              background: view === tab ? 'var(--color-bg-tertiary)' : 'transparent',
              color: view === tab ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
            }}
            aria-label={`${tab} view`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-5 py-4">
        {view === 'timer' ? (
          <TimerView
            isLandscape={isLandscape}
            showBlockReminder={showBlockReminder}
            onDismissReminder={() => setShowBlockReminder(false)}
          />
        ) : (
          <StatsView />
        )}
      </main>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  )
}

function TimerView({ isLandscape, showBlockReminder, onDismissReminder }: {
  isLandscape: boolean
  showBlockReminder: boolean
  onDismissReminder: () => void
}) {
  const timerState = useTimerStore((s) => s.state)

  return (
    <div className={`flex ${isLandscape ? 'flex-row items-center gap-8 justify-center h-full' : 'flex-col items-center gap-6'}`}>
      {/* Timer section */}
      <div className={`flex flex-col items-center gap-4 ${isLandscape ? 'flex-shrink-0' : ''}`}>
        <SessionLabel />
        <div className={isLandscape ? 'scale-[0.85]' : ''}>
          <TimerRing />
        </div>
        <TimerControls />
      </div>

      {/* Side panel */}
      <div className={`${isLandscape ? 'flex-1 max-w-xs space-y-4 max-h-full overflow-y-auto' : 'w-full max-w-sm space-y-4'}`}>
        {showBlockReminder && timerState === 'running' && (
          <BlockReminder onDismiss={onDismissReminder} />
        )}
        <ProgressBar />
        <AmbientToggle />
        <TaskList />
      </div>
    </div>
  )
}

function StatsView() {
  return (
    <div className="max-w-sm mx-auto space-y-6 fade-enter">
      <StatsCard />
      <WeeklyHeatmap />
    </div>
  )
}
