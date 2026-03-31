import { useEffect } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import { startSound, stopSound, setVolume } from '../lib/sounds'

export function useSound() {
  const { ambientSound, ambientVolume, soundEnabled } = useSettingsStore()

  useEffect(() => {
    if (soundEnabled && ambientSound !== 'none') {
      startSound(ambientSound, ambientVolume)
    } else {
      stopSound()
    }
    return () => { stopSound() }
  }, [ambientSound, soundEnabled])

  useEffect(() => {
    if (soundEnabled) {
      setVolume(ambientVolume)
    }
  }, [ambientVolume, soundEnabled])
}
