import { create } from 'zustand'
import type { TimerSettings, AmbientSound } from '../types'
import { loadSettings, saveSettings } from '../lib/db'

interface SettingsState extends TimerSettings {
  theme: 'dark' | 'light'
  ambientSound: AmbientSound
  ambientVolume: number
  soundEnabled: boolean
  initialized: boolean
  init: () => Promise<void>
  update: (partial: Partial<TimerSettings>) => void
  setTheme: (theme: 'dark' | 'light') => void
  setAmbientSound: (sound: AmbientSound) => void
  setAmbientVolume: (volume: number) => void
  toggleSound: () => void
}

const defaults: TimerSettings = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  longBreakInterval: 4,
  dailyTarget: 8,
  autoStartBreaks: false,
  autoStartFocus: false,
  focusMantra: 'Deep work. No distractions.',
  blockList: ['Twitter', 'YouTube', 'Reddit', 'Discord', 'Instagram'],
  showCommitment: true,
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaults,
  theme: 'dark',
  ambientSound: 'none',
  ambientVolume: 50,
  soundEnabled: false,
  initialized: false,

  init: async () => {
    const saved = await loadSettings()
    if (saved) {
      set({ ...saved, initialized: true })
    } else {
      set({ initialized: true })
    }
    const theme = get().theme
    document.documentElement.setAttribute('data-theme', theme)
  },

  update: (partial) => {
    set(partial)
    const state = get()
    const settings: TimerSettings = {
      focusDuration: state.focusDuration,
      shortBreakDuration: state.shortBreakDuration,
      longBreakDuration: state.longBreakDuration,
      longBreakInterval: state.longBreakInterval,
      dailyTarget: state.dailyTarget,
      autoStartBreaks: state.autoStartBreaks,
      autoStartFocus: state.autoStartFocus,
      focusMantra: state.focusMantra,
      blockList: state.blockList,
      showCommitment: state.showCommitment,
    }
    saveSettings(settings)
  },

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    set({ theme })
  },

  setAmbientSound: (ambientSound) => set({ ambientSound }),
  setAmbientVolume: (ambientVolume) => set({ ambientVolume }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
}))
