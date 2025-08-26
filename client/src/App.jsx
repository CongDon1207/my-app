import { useEffect, useState } from 'react'
import { createTask, toggleTask, deleteTask } from './api/tasks';
import './App.css'
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';


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

  async function addTask(title) {
    try {
      const newTask = await createTask(title);
      setTasks(prev => [newTask, ...prev]);
    } catch (e) {
      setErr(e.message || 'Tạo task thất bại');
      throw e; // để TaskForm biết và hiển thị lỗi cục bộ
    }
  }


  return (
    <div className="app-wrapper">
      
      <div className="task-box">
        <h1>Danh sách Tasks</h1>

        {err && <p className="error">{err}</p>}

        <TaskForm onAdd={addTask} />

        <ul className="task-list">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>

      </div>
    </div>
  )
}

export default App
