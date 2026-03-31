import { useSettingsStore } from '../stores/settingsStore'
import type { AmbientSound } from '../types'

const SOUNDS: { id: AmbientSound; label: string; icon: string }[] = [
  { id: 'rain', label: 'Rain', icon: '🌧' },
  { id: 'cafe', label: 'Café', icon: '☕' },
  { id: 'deepFocus', label: 'Deep Focus', icon: '🧠' },
  { id: 'forest', label: 'Forest', icon: '🌲' },
]

export function AmbientToggle() {
  const { ambientSound, ambientVolume, soundEnabled, setAmbientSound, setAmbientVolume, toggleSound } = useSettingsStore()

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-heading font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
          Ambient Sound
        </h3>
        <button
          onClick={toggleSound}
          className="btn-press w-10 h-5 rounded-full relative transition-colors"
          style={{ background: soundEnabled ? 'var(--color-accent)' : 'var(--color-bg-tertiary)' }}
          aria-label={soundEnabled ? 'Disable ambient sound' : 'Enable ambient sound'}
        >
          <div
            className="w-4 h-4 rounded-full absolute top-0.5 transition-all"
            style={{
              background: '#fff',
              left: soundEnabled ? '22px' : '2px',
            }}
          />
        </button>
      </div>

      {soundEnabled && (
        <>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {SOUNDS.map((s) => (
              <button
                key={s.id}
                onClick={() => setAmbientSound(s.id)}
                className="btn-press flex flex-col items-center gap-1 rounded-xl py-2 transition-colors text-xs"
                style={{
                  background: ambientSound === s.id ? 'var(--color-accent-soft)' : 'var(--color-bg-tertiary)',
                  border: ambientSound === s.id ? '1px solid var(--color-accent-glow)' : '1px solid transparent',
                  color: ambientSound === s.id ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                }}
                aria-label={`Select ${s.label} ambient sound`}
              >
                <span className="text-lg">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={ambientVolume}
            onChange={(e) => setAmbientVolume(Number(e.target.value))}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{ background: 'var(--color-bg-tertiary)', accentColor: 'var(--color-accent)' }}
            aria-label="Ambient volume"
          />
        </>
      )}
    </div>
  )
}
