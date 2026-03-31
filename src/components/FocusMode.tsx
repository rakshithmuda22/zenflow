import { TimerRing } from './TimerRing'
import { SessionLabel } from './SessionLabel'
import { TimerControls } from './TimerControls'
import { TaskList } from './TaskList'
import { useSettingsStore } from '../stores/settingsStore'
import { useTaskStore } from '../stores/taskStore'
import { useOrientation } from '../hooks/useOrientation'

interface FocusModeProps {
  onExit: () => void
}

export function FocusMode({ onExit }: FocusModeProps) {
  const { focusMantra } = useSettingsStore()
  const tasks = useTaskStore((s) => s.tasks)
  const isLandscape = useOrientation()
  const hasTasks = tasks.length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col safe-area-pad overflow-hidden"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      {/* Exit button — pushed below safe area with calc + env() */}
      <button
        onClick={onExit}
        className="absolute right-4 z-10 text-xs px-3 py-1.5 rounded-lg btn-press"
        style={{
          top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
          color: 'var(--color-text-tertiary)',
          background: 'var(--color-bg-tertiary)',
        }}
        aria-label="Exit focus mode"
      >
        Exit
      </button>

      {/* Main content */}
      {isLandscape ? (
        /* ===== LANDSCAPE ===== */
        <div className={`flex-1 flex items-center ${hasTasks ? 'justify-center gap-8 px-8' : 'justify-center'}`}>
          {/* Timer section */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <SessionLabel />
            <div className="scale-[0.75]">
              <TimerRing />
            </div>
            <TimerControls />
            {focusMantra && (
              <p
                className="text-xs italic max-w-[200px] text-center"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {focusMantra}
              </p>
            )}
          </div>

          {/* Tasks section — only if tasks exist */}
          {hasTasks && (
            <div
              className="flex-shrink-0 w-64 max-h-full overflow-y-auto rounded-2xl p-4"
              style={{ background: 'var(--color-bg-secondary)' }}
            >
              <TaskList />
            </div>
          )}
        </div>
      ) : (
        /* ===== PORTRAIT ===== */
        <div className={`flex-1 flex flex-col ${hasTasks ? 'justify-start pt-16' : 'justify-center'} items-center overflow-y-auto`}>
          {/* Timer section */}
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <SessionLabel />
            <TimerRing />
            <TimerControls />
            {focusMantra && (
              <p
                className="text-sm italic max-w-xs text-center"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {focusMantra}
              </p>
            )}
          </div>

          {/* Tasks section — only if tasks exist */}
          {hasTasks && (
            <div className="w-full max-w-sm mt-6 px-5 pb-8">
              <TaskList />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
