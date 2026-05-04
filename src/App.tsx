import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

const STORAGE_KEY = 'task-boad:tasks'

type Task = {
  id: string
  text: string
  completed: boolean
}

function isTask(value: unknown): value is Task {
  if (value === null || typeof value !== 'object') return false
  const o = value as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.text === 'string' &&
    typeof o.completed === 'boolean'
  )
}

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isTask)
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())
  const [input, setInput] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false },
    ])
    setInput('')
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">タスクボード</h1>
      </header>

      <form className="app__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="app__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="新しいタスクを入力"
          aria-label="タスクの内容"
          autoComplete="off"
        />
        <button type="submit" className="app__add">
          追加
        </button>
      </form>

      <ul className="task-list" aria-label="タスク一覧">
        {tasks.length === 0 ? (
          <li className="task-list__empty">タスクがありません</li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className={
                task.completed ? 'task task--completed' : 'task'
              }
            >
              <label className="task__label">
                <input
                  type="checkbox"
                  className="task__check"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  aria-label={
                    task.completed ? '未完了に戻す' : '完了にする'
                  }
                />
                <span className="task__text">{task.text}</span>
              </label>
              <button
                type="button"
                className="task__delete"
                onClick={() => deleteTask(task.id)}
                aria-label="タスクを削除"
              >
                削除
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default App
