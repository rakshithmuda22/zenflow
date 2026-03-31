import { useEffect, useRef, useCallback } from 'react'
import { useTimerStore } from '../stores/timerStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useSessionStore } from '../stores/sessionStore'
import { useTaskStore } from '../stores/taskStore'
import { launchConfetti } from '../lib/confetti'
import type { SessionType, Session } from '../types'

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function useTimer() {
  const state = useTimerStore((s) => s.state)
  const sessionType = useTimerStore((s) => s.sessionType)
  const totalSeconds = useTimerStore((s) => s.totalSeconds)
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds)
  const sessionCount = useTimerStore((s) => s.sessionCount)
  const start = useTimerStore((s) => s.start)
  const pause = useTimerStore((s) => s.pause)
  const resume = useTimerStore((s) => s.resume)
  const skip = useTimerStore((s) => s.skip)
  const reset = useTimerStore((s) => s.reset)
  const incrementSession = useTimerStore((s) => s.incrementSession)

  const focusDuration = useSettingsStore((s) => s.focusDuration)
  const shortBreakDuration = useSettingsStore((s) => s.shortBreakDuration)
  const longBreakDuration = useSettingsStore((s) => s.longBreakDuration)
  const longBreakInterval = useSettingsStore((s) => s.longBreakInterval)
  const autoStartBreaks = useSettingsStore((s) => s.autoStartBreaks)
  const autoStartFocus = useSettingsStore((s) => s.autoStartFocus)

  const addSession = useSessionStore((s) => s.addSession)
  const selectedTaskId = useTaskStore((s) => s.selectedTaskId)
  const addFocusTime = useTaskStore((s) => s.addFocusTime)

  const rafRef = useRef<number>(0)
  const sessionStartRef = useRef<number>(0)

  const getNextSessionType = useCallback((): SessionType => {
    const count = sessionCount + 1
    if (count % longBreakInterval === 0) return 'longBreak'
    return 'shortBreak'
  }, [sessionCount, longBreakInterval])

  const getDuration = useCallback((type: SessionType): number => {
    switch (type) {
      case 'focus': return focusDuration
      case 'shortBreak': return shortBreakDuration
      case 'longBreak': return longBreakDuration
    }
  }, [focusDuration, shortBreakDuration, longBreakDuration])

  const notifyUser = useCallback((title: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { icon: '/icon-192.png', badge: '/icon-192.png' })
    }
    try { navigator.vibrate?.([200, 100, 200]) } catch { /* no vibration */ }
  }, [])

  const startFocus = useCallback(() => {
    sessionStartRef.current = Date.now()
    start(focusDuration, 'focus')
  }, [start, focusDuration])

  const startBreak = useCallback(() => {
    const breakType = getNextSessionType()
    const duration = getDuration(breakType)
    start(duration, breakType)
  }, [start, getNextSessionType, getDuration])

  const handleComplete = useCallback(() => {
    const timerState = useTimerStore.getState()
    const session: Session = {
      id: uid(),
      type: timerState.sessionType,
      startedAt: sessionStartRef.current || Date.now(),
      completedAt: Date.now(),
      duration: timerState.totalSeconds,
      taskId: timerState.sessionType === 'focus' ? (selectedTaskId ?? undefined) : undefined,
      abandoned: false,
    }
    addSession(session)

    if (timerState.sessionType === 'focus') {
      incrementSession()
      if (selectedTaskId) {
        addFocusTime(selectedTaskId, timerState.totalSeconds)
      }
      launchConfetti()
      notifyUser('Focus session complete! Time for a break.')

      if (autoStartBreaks) {
        setTimeout(() => startBreak(), 1500)
      }
    } else {
      notifyUser('Break is over! Ready to focus?')
      if (autoStartFocus) {
        setTimeout(() => startFocus(), 1500)
      }
    }
  }, [selectedTaskId, addSession, addFocusTime, incrementSession, notifyUser, autoStartBreaks, autoStartFocus, startBreak, startFocus])

  // Animation frame tick
  useEffect(() => {
    if (state === 'idle' || state === 'paused' || state === 'completed') {
      cancelAnimationFrame(rafRef.current)
      return
    }

    let prevCompleted = false
    const tick = () => {
      const current = useTimerStore.getState()
      if (current.state === 'idle' || current.state === 'paused' || current.state === 'completed') return

      current.tick()
      const afterTick = useTimerStore.getState()
      if (afterTick.remainingSeconds <= 0 && !prevCompleted) {
        prevCompleted = true
        handleComplete()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
  }, [state, handleComplete])

  // Visibility recovery
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        useTimerStore.getState().recoverFromBackground()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return {
    state,
    sessionType,
    totalSeconds,
    remainingSeconds,
    sessionCount,
    start,
    pause,
    resume,
    skip,
    reset,
    incrementSession,
    startFocus,
    startBreak,
    getDuration,
    getNextSessionType,
  }
}
