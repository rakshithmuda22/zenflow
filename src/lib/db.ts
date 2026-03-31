import { get, set } from 'idb-keyval'
import type { Session, Task, TimerSettings, DayData } from '../types'

const KEYS = {
  sessions: 'zenflow-sessions',
  tasks: 'zenflow-tasks',
  settings: 'zenflow-settings',
  dayData: 'zenflow-daydata',
} as const

export async function loadSessions(): Promise<Session[]> {
  return (await get(KEYS.sessions)) ?? []
}

export async function saveSessions(sessions: Session[]) {
  await set(KEYS.sessions, sessions)
}

export async function loadTasks(): Promise<Task[]> {
  return (await get(KEYS.tasks)) ?? []
}

export async function saveTasks(tasks: Task[]) {
  await set(KEYS.tasks, tasks)
}

export async function loadSettings(): Promise<TimerSettings | null> {
  return (await get(KEYS.settings)) ?? null
}

export async function saveSettings(settings: TimerSettings) {
  await set(KEYS.settings, settings)
}

export async function loadDayData(): Promise<DayData[]> {
  return (await get(KEYS.dayData)) ?? []
}

export async function saveDayData(data: DayData[]) {
  await set(KEYS.dayData, data)
}
