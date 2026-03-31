import { useCallback, useRef } from 'react'
import { useTimerStore } from '../stores/timerStore'
import { useTaskStore } from '../stores/taskStore'
import type { Task } from '../types'

declare global {
  interface DocumentPictureInPicture {
    requestWindow(options?: { width?: number; height?: number }): Promise<Window>
    window: Window | null
  }
  // eslint-disable-next-line no-var
  var documentPictureInPicture: DocumentPictureInPicture | undefined
}

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

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function taskHtml(tasks: Task[], selectedId: string | null): string {
  if (!tasks.length) return ''
  return tasks.map(t => {
    const sel = t.id === selectedId
    const bullet = t.completed ? '&#10003; ' : sel ? '&#9679; ' : '&#9675; '
    const css = t.completed
      ? 'color:#5C5A63;text-decoration:line-through;'
      : sel ? 'color:#FF6B35;' : 'color:#F0EDE6;'
    return `<div class="tk" style="${css}">${bullet}${esc(t.title)}</div>`
  }).join('')
}

// Canvas fallback constants
const W = 340, H = 200

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
    if (active.length > 4) {
      ctx.fillStyle = '#5C5A63'
      ctx.font = '400 11px DM Sans, sans-serif'
      ctx.fillText(`+${active.length - 4} more`, 20, 132 + 4 * 18)
    }
  }
}

export function usePiP() {
  const pipWinRef = useRef<Window | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rafRef = useRef<number>(0)
  const unsubsRef = useRef<(() => void)[]>([])
  const activeRef = useRef(false)
  const modeRef = useRef<'doc' | 'video' | null>(null)

  const hasDocPiP = typeof documentPictureInPicture !== 'undefined'
  const hasVideoPiP = typeof document !== 'undefined' && 'pictureInPictureEnabled' in document
  const isSupported = hasDocPiP || hasVideoPiP

  // Synchronous cleanup — MUST NOT be async to preserve user gesture
  const cleanupSync = useCallback(() => {
    activeRef.current = false
    unsubsRef.current.forEach(u => u())
    unsubsRef.current = []
    cancelAnimationFrame(rafRef.current)
    if (modeRef.current === 'doc') {
      pipWinRef.current?.close()
      pipWinRef.current = null
    }
    if (modeRef.current === 'video') {
      try { document.exitPictureInPicture() } catch { /* ignore */ }
      videoRef.current?.remove()
      videoRef.current = null
      canvasRef.current?.remove()
      canvasRef.current = null
    }
    modeRef.current = null
  }, [])

  const setupDocPiP = useCallback((win: Window) => {
    pipWinRef.current = win
    modeRef.current = 'doc'

    const link = win.document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&family=DM+Sans:wght@400;500&display=swap'
    win.document.head.appendChild(link)

    const style = win.document.createElement('style')
    style.textContent = `
      *{margin:0;padding:0;box-sizing:border-box}
      body{background:#0A0A0F;color:#F0EDE6;font-family:'Outfit',sans-serif;
        display:flex;flex-direction:column;height:100vh;overflow:hidden;user-select:none}
      #ts{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px 16px 8px;flex-shrink:0}
      #tm{font-size:42px;font-weight:700;letter-spacing:-0.03em;line-height:1;font-variant-numeric:tabular-nums}
      #lb{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-top:3px}
      .fo{color:#FF6B35}.br{color:#34D399}
      #tks{flex:1;overflow-y:auto;padding:0 12px 8px;border-top:1px solid #ffffff10;margin-top:6px}
      #th{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#5C5A63;padding:8px 0 4px}
      .tk{font-family:'DM Sans',sans-serif;font-size:12px;padding:3px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      #pg{position:absolute;bottom:0;left:0;height:3px;border-radius:0 2px 2px 0;transition:width .5s linear}
    `
    win.document.head.appendChild(style)

    win.document.body.innerHTML = `
      <div id="ts"><div id="tm">--:--</div><div id="lb" class="fo">\u2014</div></div>
      <div id="tks" style="display:none"><div id="th">Tasks</div><div id="tl"></div></div>
      <div id="pg" style="background:#FF6B35;width:100%"></div>
    `

    const tmEl = win.document.getElementById('tm')!
    const lbEl = win.document.getElementById('lb')!
    const tksEl = win.document.getElementById('tks')!
    const tlEl = win.document.getElementById('tl')!
    const pgEl = win.document.getElementById('pg')!

    const renderTimer = () => {
      const s = useTimerStore.getState()
      tmEl.textContent = fmt(s.remainingSeconds)
      lbEl.textContent = sessionLabel(s.sessionType, s.sessionCount, s.state)
      const b = s.sessionType !== 'focus'
      lbEl.className = b ? 'br' : 'fo'
      pgEl.style.background = b ? '#34D399' : '#FF6B35'
      pgEl.style.width = `${s.totalSeconds > 0 ? (s.remainingSeconds / s.totalSeconds) * 100 : 100}%`
    }

    const renderTasks = () => {
      const { tasks, selectedTaskId } = useTaskStore.getState()
      if (!tasks.length) { tksEl.style.display = 'none'; return }
      tksEl.style.display = 'block'
      tlEl.innerHTML = taskHtml(tasks, selectedTaskId)
    }

    renderTimer()
    renderTasks()

    const u1 = useTimerStore.subscribe(renderTimer)
    const u2 = useTaskStore.subscribe(renderTasks)
    unsubsRef.current = [u1, u2]
    activeRef.current = true

    win.addEventListener('pagehide', () => cleanupSync())
  }, [cleanupSync])

  // NOT async — requestWindow must be called synchronously in the user gesture
  const openPiP = useCallback(() => {
    if (activeRef.current) {
      cleanupSync()
      return
    }

    // Video PiP first — gives true system-level always-on-top floating window
    // Document PiP only floats within Chrome, Video PiP floats across ALL apps
    tryVideoPiP()

    function tryVideoPiP() {
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
        modeRef.current = 'video'
        activeRef.current = true
        let last = 0
        const loop = (ts: number) => {
          if (!activeRef.current) return
          if (ts - last > 66) { drawFrame(ctx); last = ts }
          rafRef.current = requestAnimationFrame(loop)
        }
        rafRef.current = requestAnimationFrame(loop)
        video.addEventListener('leavepictureinpicture', () => cleanupSync())
      }).catch(() => {
        cleanupSync()
      })
    }
  }, [cleanupSync, hasDocPiP, hasVideoPiP, setupDocPiP])

  return { openPiP, closePiP: cleanupSync, isSupported, isActive: () => activeRef.current }
}
