import { useEffect, useState } from 'react'
import { toggleTask, deleteTask } from './api/tasks';
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => {
        console.error('Lỗi tải tasks:', err)
        setErr('Không tải được danh sách')
      })
  }, [])

  async function onToggle(id) {
    try {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
      const updated = await toggleTask(id)
      setTasks(prev => prev.map(t => t.id === id ? { ...t, done: updated.done } : t))
    } catch (e) {
      setErr(e.message || 'Toggle thất bại')
    }
  }

  async function onDelete(id) {
    try {
      setTasks(prev => prev.filter(t => t.id !== id))
      await deleteTask(id)
    } catch (e) {
      setErr(e.message || 'Xoá thất bại')
    }
  }

  return (
    <div className="app-wrapper">
      <div className="task-box">
        <h1>Danh sách Tasks</h1>

        {err && <p className="error">{err}</p>}
        
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className="task-item">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggle(task.id)}
                title="Toggle done"
              />
              <span className={task.done ? "task-done" : ""}>
                {task.title}
              </span>
              <button onClick={() => onDelete(task.id)} title="Xoá task">🗑️</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
