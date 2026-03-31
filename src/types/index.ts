export type TimerState = 'idle' | 'running' | 'paused' | 'break' | 'longBreak' | 'completed'

export type SessionType = 'focus' | 'shortBreak' | 'longBreak'

export interface Session {
  id: string
  type: SessionType
  startedAt: number
  completedAt: number
  duration: number
  taskId?: string
  abandoned: boolean
}

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: number
  totalFocusTime: number
}

export type AmbientSound = 'rain' | 'cafe' | 'deepFocus' | 'forest' | 'none'

export interface TimerSettings {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  dailyTarget: number
  autoStartBreaks: boolean
  autoStartFocus: boolean
  focusMantra: string
  blockList: string[]
  showCommitment: boolean
}

export interface DayData {
  date: string
  focusMinutes: number
  sessionsCompleted: number
}
