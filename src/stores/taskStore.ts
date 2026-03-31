import { create } from 'zustand'
import type { Task } from '../types'
import { loadTasks, saveTasks } from '../lib/db'

interface TaskState {
  tasks: Task[]
  selectedTaskId: string | null
  initialized: boolean
  init: () => Promise<void>
  addTask: (title: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  selectTask: (id: string | null) => void
  addFocusTime: (taskId: string, seconds: number) => void
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTaskId: null,
  initialized: false,

  init: async () => {
    const tasks = await loadTasks()
    set({ tasks, initialized: true })
  },

  addTask: (title) => {
    const task: Task = {
      id: uid(),
      title,
      completed: false,
      createdAt: Date.now(),
      totalFocusTime: 0,
    }
    const tasks = [...get().tasks, task]
    set({ tasks })
    saveTasks(tasks)
  },

  toggleTask: (id) => {
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    )
    set({ tasks })
    saveTasks(tasks)
  },

  deleteTask: (id) => {
    const tasks = get().tasks.filter((t) => t.id !== id)
    const selectedTaskId = get().selectedTaskId === id ? null : get().selectedTaskId
    set({ tasks, selectedTaskId })
    saveTasks(tasks)
  },

  selectTask: (id) => set({ selectedTaskId: id }),

  addFocusTime: (taskId, seconds) => {
    const tasks = get().tasks.map((t) =>
      t.id === taskId ? { ...t, totalFocusTime: t.totalFocusTime + seconds } : t
    )
    set({ tasks })
    saveTasks(tasks)
  },
}))
