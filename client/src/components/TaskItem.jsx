// client/src/components/TaskItem.jsx
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="task-item">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        title="Toggle done"
      />
      <span className={task.done ? 'task-done' : ''}>
        {task.title}
      </span>
      <button onClick={() => onDelete(task.id)} title="Xoá task">🗑️</button>
    </li>
  );
}

export default TaskItem;
