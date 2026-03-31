import { useCallback, useRef } from 'react'
import { useTimerStore } from '../stores/timerStore'
import { useTaskStore } from '../stores/taskStore'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function getSessionLabel(sessionType: string, sessionCount: number, state: string): string {
  if (state === 'idle') return 'Ready'
  if (state === 'completed') return 'Done!'
  if (sessionType === 'focus') return `Focus #${sessionCount + 1}`
  if (sessionType === 'shortBreak') return 'Short Break'
  return 'Long Break'
}

const W = 340
const H = 200

function drawFrame(ctx: CanvasRenderingContext2D) {
  const timer = useTimerStore.getState()
  const { tasks, selectedTaskId } = useTaskStore.getState()
  const activeTasks = tasks.filter((t) => !t.completed)

  const isBreak = timer.sessionType !== 'focus'
  const accent = isBreak ? '#34D399' : '#FF6B35'

  // Background
  ctx.fillStyle = '#0A0A0F'
  ctx.fillRect(0, 0, W, H)

  // Time
  ctx.fillStyle = '#F0EDE6'
  ctx.font = 'bold 52px Outfit, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.letterSpacing = '-1.5px'
  ctx.fillText(formatTime(timer.remainingSeconds), W / 2, 48)
  ctx.letterSpacing = '0px'

  // Session label
  ctx.fillStyle = accent
  ctx.font = '600 11px Outfit, sans-serif'
  ctx.fillText(
    getSessionLabel(timer.sessionType, timer.sessionCount, timer.state).toUpperCase(),
    W / 2,
    82
  )

  // Progress bar
  const progress = timer.totalSeconds > 0 ? timer.remainingSeconds / timer.totalSeconds : 1
  ctx.fillStyle = '#ffffff10'
  ctx.fillRect(0, H - 4, W, 4)
  ctx.fillStyle = accent
  ctx.fillRect(0, H - 4, W * progress, 4)

  // Tasks
  if (activeTasks.length > 0) {
    // Divider
    ctx.fillStyle = '#ffffff10'
    ctx.fillRect(20, 96, W - 40, 1)

    // Tasks header
    ctx.fillStyle = '#5C5A63'
    ctx.font = '600 9px Outfit, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('TASKS', 20, 114)

    // Task list
    ctx.font = '400 13px DM Sans, sans-serif'
    const maxTasks = 4
    const displayTasks = activeTasks.slice(0, maxTasks)
    displayTasks.forEach((task, i) => {
      const y = 132 + i * 18
      const isSelected = task.id === selectedTaskId
      const bullet = isSelected ? '\u25CF ' : '\u25CB '
      ctx.fillStyle = isSelected ? accent : '#9B97A0'
      const title = task.title.length > 30 ? task.title.slice(0, 28) + '...' : task.title
      ctx.fillText(bullet + title, 20, y)
    })
    if (activeTasks.length > maxTasks) {
      ctx.fillStyle = '#5C5A63'
      ctx.font = '400 11px DM Sans, sans-serif'
      ctx.fillText(`+${activeTasks.length - maxTasks} more`, 20, 132 + maxTasks * 18)
    }
  }
}

export function usePiP() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rafRef = useRef<number>(0)
  const activeRef = useRef(false)

  const isSupported = typeof document !== 'undefined' && 'pictureInPictureEnabled' in document

  const closePiP = useCallback(async () => {
    activeRef.current = false
    cancelAnimationFrame(rafRef.current)
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture().catch(() => {})
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current.remove()
      videoRef.current = null
    }
    if (canvasRef.current) {
      canvasRef.current.remove()
      canvasRef.current = null
    }
  }, [])

  const openPiP = useCallback(async () => {
    if (activeRef.current) {
      await closePiP()
      return
    }

    // Create offscreen canvas
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    canvas.style.display = 'none'
    document.body.appendChild(canvas)
    canvasRef.current = canvas

    const ctx = canvas.getContext('2d')!

    // Create video from canvas stream
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

    await video.play()

    // Request PiP
    try {
      await video.requestPictureInPicture()
    } catch {
      closePiP()
      return
    }

    activeRef.current = true

    // Animation loop — draw at ~15fps to save CPU
    let lastDraw = 0
    const loop = (ts: number) => {
      if (!activeRef.current) return
      if (ts - lastDraw > 66) { // ~15fps
        drawFrame(ctx)
        lastDraw = ts
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    // Cleanup when user closes PiP
    video.addEventListener('leavepictureinpicture', () => {
      closePiP()
    })
  }, [closePiP])

  return { openPiP, closePiP, isSupported, isActive: () => activeRef.current }
}
