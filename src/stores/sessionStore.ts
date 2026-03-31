import { create } from 'zustand'
import type { Session, DayData } from '../types'
import { loadSessions, saveSessions, loadDayData, saveDayData } from '../lib/db'

function getDateKey(ts?: number): string {
  const d = ts ? new Date(ts) : new Date()
  return d.toISOString().slice(0, 10)
}

function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr + 'T12:00:00').getDay()
}

interface SessionState {
  sessions: Session[]
  dayData: DayData[]
  initialized: boolean
  init: () => Promise<void>
  addSession: (session: Session) => void
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  dayData: [],
  initialized: false,

  init: async () => {
    const [sessions, dayData] = await Promise.all([loadSessions(), loadDayData()])
    set({ sessions, dayData, initialized: true })
  },

  addSession: (session) => {
    const sessions = [...get().sessions, session]
    set({ sessions })
    saveSessions(sessions)

    if (!session.abandoned && session.type === 'focus') {
      const dateKey = getDateKey(session.completedAt)
      const dayData = [...get().dayData]
      const idx = dayData.findIndex((d) => d.date === dateKey)
      if (idx >= 0) {
        dayData[idx] = {
          ...dayData[idx],
          focusMinutes: dayData[idx].focusMinutes + Math.round(session.duration / 60),
          sessionsCompleted: dayData[idx].sessionsCompleted + 1,
        }
      } else {
        dayData.push({
          date: dateKey,
          focusMinutes: Math.round(session.duration / 60),
          sessionsCompleted: 1,
        })
      }
      set({ dayData })
      saveDayData(dayData)
    }
  },
}))

// Pure helper functions — no store dependency, call with data from selectors
export function getTodayCompleted(dayData: DayData[]): number {
  const today = getDateKey()
  const dd = dayData.find((d) => d.date === today)
  return dd?.sessionsCompleted ?? 0
}

export function getTodayFocusMinutes(dayData: DayData[]): number {
  const today = getDateKey()
  const dd = dayData.find((d) => d.date === today)
  return dd?.focusMinutes ?? 0
}

export function getWeekData(dayData: DayData[]): DayData[] {
  const data: DayData[] = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const existing = dayData.find((dd) => dd.date === key)
    data.push(existing ?? { date: key, focusMinutes: 0, sessionsCompleted: 0 })
  }
  return data
}

export function getStreak(dayData: DayData[]): number {
  let count = 0
  const now = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const day = dayData.find((dd) => dd.date === key)
    const dow = getDayOfWeek(key)
    if (dow === 0 || dow === 6) continue
    if (day && day.sessionsCompleted >= 4) {
      count++
    } else if (i > 0) {
      break
    }
  }
  return count
}

export function getAllTimeFocusMinutes(dayData: DayData[]): number {
  return dayData.reduce((sum, d) => sum + d.focusMinutes, 0)
}

export function getCompletionRate(sessions: Session[]): number {
  const focus = sessions.filter((s) => s.type === 'focus')
  if (focus.length === 0) return 100
  const completed = focus.filter((s) => !s.abandoned).length
  return Math.round((completed / focus.length) * 100)
}

export function getAvgSessionMinutes(sessions: Session[]): number {
  const completed = sessions.filter((s) => s.type === 'focus' && !s.abandoned)
  if (completed.length === 0) return 0
  const total = completed.reduce((sum, s) => sum + s.duration, 0)
  return Math.round(total / completed.length / 60)
}
