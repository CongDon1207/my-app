// client/src/components/TaskItem.jsx
import { useState, useRef, useEffect } from 'react';
import styles from './TaskItem.module.css'; // <-- thêm

function TaskItem({ task, onToggle, onDelete }) {
  const [pendingToggle, setPendingToggle] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);

  async function handleToggle() {
    if (pendingToggle) return;
    setPendingToggle(true);
    try {
      await onToggle(task.id);
    } finally {
      setPendingToggle(false);
    }
  }

  async function handleDelete() {
    if (pendingDelete) return;
    setPendingDelete(true);
    try {
      await onDelete(task.id);
    } finally {
      setPendingDelete(false);
    }
  }

  return (
    <li className="task-item">
      <input
        type="checkbox"
        checked={task.done}
        onChange={handleToggle}
        title="Toggle done"
        disabled={pendingToggle || pendingDelete}
        aria-disabled={pendingToggle || pendingDelete ? 'true' : undefined}
      />

      <span className={task.done ? 'task-done' : ''}>{task.title}</span>

      {confirming ? (
        <div role="dialog" aria-modal="true" aria-labelledby={`confirm-${task.id}`} className={styles.confirm}>
          <span id={`confirm-${task.id}`}>Xoá task này?</span>
          <button
            ref={confirmRef}
            onClick={handleDelete}
            disabled={pendingDelete}
            aria-disabled={pendingDelete ? 'true' : undefined}
            className={styles.btn}
            data-variant="danger"
          >
            {pendingDelete ? 'Đang xoá...' : 'Có'}
          </button>
          <button onClick={() => setConfirming(false)} className={styles.btn}>Huỷ</button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          title="Xoá task"
          disabled={pendingToggle || pendingDelete}
          aria-disabled={pendingToggle || pendingDelete ? 'true' : undefined}
          className={styles.iconBtn}
        >
          🗑️
        </button>
      )}

      {(pendingToggle || pendingDelete) && (
        <span role="status" aria-live="polite" className={styles.srNote}>
          {pendingToggle ? 'Đang cập nhật...' : 'Đang xoá...'}
        </span>
      )}
    </li>
  );
}

export default TaskItem;
