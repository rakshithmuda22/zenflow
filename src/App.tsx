import { useEffect, useState } from 'react'
import { useTimerStore } from './stores/timerStore'
import { useSettingsStore } from './stores/settingsStore'
import { useOrientation } from './hooks/useOrientation'
import { TimerRing } from './components/TimerRing'
import { TimerControls } from './components/TimerControls'
import { SessionLabel } from './components/SessionLabel'

export default function App() {
  const settingsInit = useSettingsStore((s) => s.initialized)
  const initSettings = useSettingsStore((s) => s.init)
  const isLandscape = useOrientation()

  useEffect(() => { initSettings() }, [initSettings])

  if (!settingsInit) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col safe-area-pad" style={{ background: 'var(--color-bg-primary)' }}>
      <header className="flex items-center justify-between px-5 pt-3 pb-2 flex-shrink-0">
        <h1 className="font-heading font-bold text-lg tracking-[-0.03em]" style={{ color: 'var(--color-text-primary)' }}>
          ZenFlow
        </h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center gap-6">
        <SessionLabel />
        <TimerRing />
        <TimerControls />
      </main>
    </div>
  )
}
