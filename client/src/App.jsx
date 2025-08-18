import { useEffect, useState } from 'react'
import { toggleTask, deleteTask } from './api/tasks';

function App() {
  const [tasks, setTasks] = useState([])
  const [err, setErr] = useState('')

  // Gọi API khi component load
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => {
        console.error('Lỗi tải tasks:', err)
        setErr('Không tải được danh sách')
      })
  }, [])

  // Toggle: dùng server toggle (không truyền done)
  async function onToggle(id) {
    try {
      // Optimistic UI: lật trước
      setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
      const updated = await toggleTask(id) // server trả về row đã cập nhật
      // Đồng bộ lại với server
      setTasks(prev => prev.map(t => t.id === id ? { ...t, done: updated.done } : t))
    } catch (e) {
      setErr(e.message || 'Toggle thất bại')
      // (tuỳ chọn) refresh lại nếu muốn rollback chắc
      try {
        const res = await fetch('/api/tasks')
        const data = await res.json()
        setTasks(data)
      } catch {}
    }
  }

  // Delete
  async function onDelete(id) {
    try {
      // Optimistic remove
      setTasks(prev => prev.filter(t => t.id !== id))
      await deleteTask(id)
    } catch (e) {
      setErr(e.message || 'Xoá thất bại')
      // (tuỳ chọn) refresh lại nếu muốn rollback chắc
      try {
        const res = await fetch('/api/tasks')
        const data = await res.json()
        setTasks(data)
      } catch {}
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: 640, margin: '0 auto' }}>
      <h1>Danh sách Tasks</h1>

      {err && <p style={{ color: 'crimson' }}>{err}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 0',
                borderBottom: '1px solid #eee'
              }}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggle(task.id)}
              title="Toggle done"
            />
            <span style={{
              flex: 1,
              textDecoration: task.done ? 'line-through' : 'none',
              opacity: task.done ? 0.7 : 1
            }}>
              {task.title}
            </span>
            <button onClick={() => onDelete(task.id)} title="Xoá task">🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
