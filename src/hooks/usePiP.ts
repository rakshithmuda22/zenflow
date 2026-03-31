import { useCallback, useEffect, useRef } from 'react'
import { useTimerStore } from '../stores/timerStore'
import { useTaskStore } from '../stores/taskStore'

declare global {
  interface Window {
    zenflowElectron?: {
      toggleMini: () => void
      openMini: () => void
      closeMini: () => void
      sendTimerState: (state: Record<string, unknown>) => void
      onMiniClosed: (cb: () => void) => void
      isElectron: boolean
    }
  }
}

const isElectron = typeof window !== 'undefined' && !!window.zenflowElectron

// Canvas fallback for browser
const W = 340, H = 200

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function sessionLabel(type: string, count: number, state: string): string {
  if (state === 'idle') return 'Ready'
  if (state === 'completed') return 'Done!'
  if (type === 'focus') return `Focus #${count + 1}`
  if (type === 'shortBreak') return 'Short Break'
  return 'Long Break'
}

function drawFrame(ctx: CanvasRenderingContext2D) {
  const t = useTimerStore.getState()
  const { tasks, selectedTaskId } = useTaskStore.getState()
  const active = tasks.filter(x => !x.completed)
  const brk = t.sessionType !== 'focus'
  const accent = brk ? '#34D399' : '#FF6B35'

  ctx.fillStyle = '#0A0A0F'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#F0EDE6'
  ctx.font = 'bold 52px Outfit, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.letterSpacing = '-1.5px'
  ctx.fillText(fmt(t.remainingSeconds), W / 2, 48)
  ctx.letterSpacing = '0px'
  ctx.fillStyle = accent
  ctx.font = '600 11px Outfit, sans-serif'
  ctx.fillText(sessionLabel(t.sessionType, t.sessionCount, t.state).toUpperCase(), W / 2, 82)

  const prog = t.totalSeconds > 0 ? t.remainingSeconds / t.totalSeconds : 1
  ctx.fillStyle = '#ffffff10'
  ctx.fillRect(0, H - 4, W, 4)
  ctx.fillStyle = accent
  ctx.fillRect(0, H - 4, W * prog, 4)

  if (active.length > 0) {
    ctx.fillStyle = '#ffffff10'
    ctx.fillRect(20, 96, W - 40, 1)
    ctx.fillStyle = '#5C5A63'
    ctx.font = '600 9px Outfit, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('TASKS', 20, 114)
    ctx.font = '400 13px DM Sans, sans-serif'
    active.slice(0, 4).forEach((task, i) => {
      const y = 132 + i * 18
      const sel = task.id === selectedTaskId
      ctx.fillStyle = sel ? accent : '#9B97A0'
      const title = task.title.length > 30 ? task.title.slice(0, 28) + '...' : task.title
      ctx.fillText((sel ? '\u25CF ' : '\u25CB ') + title, 20, y)
    })
  }
}

export function usePiP() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rafRef = useRef<number>(0)
  const activeRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const hasVideoPiP = typeof document !== 'undefined' && 'pictureInPictureEnabled' in document
  const isSupported = isElectron || hasVideoPiP

  const cleanupSync = useCallback(() => {
    activeRef.current = false
    cancelAnimationFrame(rafRef.current)
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (isElectron) {
      window.zenflowElectron?.closeMini()
    } else {
      try { document.exitPictureInPicture() } catch { /* */ }
      videoRef.current?.remove()
      videoRef.current = null
      canvasRef.current?.remove()
      canvasRef.current = null
    }
  }, [])

  const sendState = useCallback(() => {
    const t = useTimerStore.getState()
    const { tasks, selectedTaskId } = useTaskStore.getState()
    window.zenflowElectron?.sendTimerState({
      remainingSeconds: t.remainingSeconds,
      totalSeconds: t.totalSeconds,
      sessionType: t.sessionType,
      sessionCount: t.sessionCount,
      timerState: t.state,
      tasks,
      selectedTaskId,
    })
  }, [])

  // Electron: send timer state to mini window every 500ms
  const startElectronSync = useCallback(() => {
    activeRef.current = true
    window.zenflowElectron?.openMini()

    // Send initial state after a short delay (mini window needs to load)
    setTimeout(sendState, 300)
    setTimeout(sendState, 800)

    intervalRef.current = setInterval(() => {
      const t = useTimerStore.getState()
      const { tasks, selectedTaskId } = useTaskStore.getState()
      window.zenflowElectron?.sendTimerState({
        remainingSeconds: t.remainingSeconds,
        totalSeconds: t.totalSeconds,
        sessionType: t.sessionType,
        sessionCount: t.sessionCount,
        timerState: t.state,
        tasks,
        selectedTaskId,
      })
    }, 500)

    window.zenflowElectron?.onMiniClosed(() => {
      activeRef.current = false
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    })
  }, [])

  const openPiP = useCallback(() => {
    if (activeRef.current) {
      cleanupSync()
      return
    }

    if (isElectron) {
      startElectronSync()
      return
    }

    // Browser fallback: Video PiP
    if (!hasVideoPiP) return
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    canvas.style.display = 'none'
    document.body.appendChild(canvas)
    canvasRef.current = canvas
    const ctx = canvas.getContext('2d')!

    const stream = canvas.captureStream(30)
    const video = document.createElement('video')
    video.srcObject = stream
    video.muted = true
    video.playsInline = true
    video.style.display = 'none'
    video.width = W
    video.height = H
    document.body.appendChild(video)
    videoRef.current = video

    video.play().then(() => {
      return video.requestPictureInPicture()
    }).then(() => {
      activeRef.current = true
      let last = 0
      const loop = (ts: number) => {
        if (!activeRef.current) return
        if (ts - last > 66) { drawFrame(ctx); last = ts }
        rafRef.current = requestAnimationFrame(loop)
      }
      rafRef.current = requestAnimationFrame(loop)
      video.addEventListener('leavepictureinpicture', () => cleanupSync())
    }).catch(() => cleanupSync())
  }, [cleanupSync, hasVideoPiP, startElectronSync])

  // Cleanup on unmount
  useEffect(() => () => cleanupSync(), [cleanupSync])

  return { openPiP, closePiP: cleanupSync, isSupported, isActive: () => activeRef.current }
}
