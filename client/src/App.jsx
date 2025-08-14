import { useEffect, useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([])

  // Gọi API khi component load
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Lỗi tải tasks:', err))
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Danh sách Tasks</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} {task.done ? '✅' : '❌'}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
