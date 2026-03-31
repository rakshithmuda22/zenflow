import { useState } from 'react'
import { useTaskStore } from '../stores/taskStore'

export function TaskList() {
  const { tasks, selectedTaskId, addTask, toggleTask, deleteTask, selectTask } = useTaskStore()
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const title = input.trim()
    if (!title) return
    addTask(title)
    setInput('')
  }

  const activeTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <div>
      <h3 className="text-xs font-heading font-semibold mb-3" style={{ color: 'var(--color-text-secondary)' }}>
        Tasks
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
          style={{
            background: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-surface-border)',
          }}
          aria-label="New task title"
        />
        <button
          type="submit"
          className="btn-press rounded-xl px-3 py-2 text-sm font-heading font-semibold"
          style={{ background: 'var(--color-accent)', color: '#fff' }}
          aria-label="Add task"
        >
          Add
        </button>
      </form>

      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {activeTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer transition-colors"
            style={{
              background: selectedTaskId === task.id ? 'var(--color-accent-soft)' : 'var(--color-bg-tertiary)',
              border: selectedTaskId === task.id ? '1px solid var(--color-accent-glow)' : '1px solid transparent',
            }}
            onClick={() => selectTask(selectedTaskId === task.id ? null : task.id)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); toggleTask(task.id) }}
              className="w-4 h-4 rounded-full border-2 flex-shrink-0"
              style={{ borderColor: 'var(--color-text-tertiary)' }}
              aria-label={`Mark ${task.title} complete`}
            />
            <span className="flex-1 text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>
              {task.title}
            </span>
            {task.totalFocusTime > 0 && (
              <span className="text-[10px] tabular-nums" style={{ color: 'var(--color-text-tertiary)' }}>
                {Math.round(task.totalFocusTime / 60)}m
              </span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); deleteTask(task.id) }}
              className="text-xs opacity-40 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--color-text-tertiary)' }}
              aria-label={`Delete ${task.title}`}
            >
              ×
            </button>
          </div>
        ))}
        {completedTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 rounded-xl px-3 py-2 opacity-50"
            style={{ background: 'var(--color-bg-tertiary)' }}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: 'var(--color-accent)' }}
              aria-label={`Mark ${task.title} incomplete`}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 4L3 5.5L6.5 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="flex-1 text-sm truncate line-through" style={{ color: 'var(--color-text-tertiary)' }}>
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
