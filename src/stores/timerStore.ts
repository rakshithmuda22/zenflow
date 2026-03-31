import { create } from 'zustand'
import type { TimerState, SessionType } from '../types'

interface TimerStoreState {
  state: TimerState
  sessionType: SessionType
  totalSeconds: number
  remainingSeconds: number
  sessionCount: number
  startTimestamp: number | null
  pauseRemaining: number | null

  start: (totalSeconds: number, sessionType: SessionType) => void
  pause: () => void
  resume: () => void
  tick: () => void
  complete: () => void
  skip: () => void
  reset: () => void
  incrementSession: () => void
  recoverFromBackground: () => void
}

export const useTimerStore = create<TimerStoreState>((set, get) => ({
  state: 'idle',
  sessionType: 'focus',
  totalSeconds: 25 * 60,
  remainingSeconds: 25 * 60,
  sessionCount: 0,
  startTimestamp: null,
  pauseRemaining: null,

  start: (totalSeconds, sessionType) => {
    const timerState: TimerState =
      sessionType === 'focus' ? 'running' :
      sessionType === 'shortBreak' ? 'break' : 'longBreak'
    set({
      state: timerState,
      sessionType,
      totalSeconds,
      remainingSeconds: totalSeconds,
      startTimestamp: Date.now(),
      pauseRemaining: null,
    })
  },

  pause: () => {
    set({
      state: 'paused',
      pauseRemaining: get().remainingSeconds,
      startTimestamp: null,
    })
  },

  resume: () => {
    const { sessionType, pauseRemaining } = get()
    const timerState: TimerState =
      sessionType === 'focus' ? 'running' :
      sessionType === 'shortBreak' ? 'break' : 'longBreak'
    set({
      state: timerState,
      startTimestamp: Date.now(),
      remainingSeconds: pauseRemaining ?? get().remainingSeconds,
      pauseRemaining: null,
    })
  },

  tick: () => {
    const { startTimestamp, pauseRemaining, totalSeconds, state } = get()
    if (!startTimestamp || state === 'paused' || state === 'idle' || state === 'completed') return

    const baseRemaining = pauseRemaining ?? totalSeconds
    const elapsed = Math.floor((Date.now() - startTimestamp) / 1000)
    const remaining = Math.max(0, baseRemaining - elapsed)
    set({ remainingSeconds: remaining })

    if (remaining <= 0) {
      get().complete()
    }
  },

  complete: () => {
    set({ state: 'completed', remainingSeconds: 0, startTimestamp: null })
  },

  skip: () => {
    set({ state: 'completed', remainingSeconds: 0, startTimestamp: null })
  },

  reset: () => {
    set({
      state: 'idle',
      sessionType: 'focus',
      totalSeconds: 25 * 60,
      remainingSeconds: 25 * 60,
      sessionCount: 0,
      startTimestamp: null,
      pauseRemaining: null,
    })
  },

  incrementSession: () => {
    set((s) => ({ sessionCount: s.sessionCount + 1 }))
  },

  recoverFromBackground: () => {
    const { startTimestamp, state } = get()
    if (startTimestamp && state !== 'paused' && state !== 'idle' && state !== 'completed') {
      get().tick()
    }
  },
}))
