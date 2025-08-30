// client/src/components/TaskForm.jsx
import { useRef, useState, useEffect } from 'react';
import { validateTaskTitle, TITLE_MAX } from '../utils/validation';
import styles from './TaskForm.module.css'; // <-- thêm

const DEBOUNCE_MS = 200;

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [toast, setToast] = useState('');
  const inputRef = useRef(null);

  const trimmed = title.trim();
  const len = trimmed.length;
  const tooLong = len > TITLE_MAX;
  const isEmpty = len === 0;
  const isInvalid = isEmpty || tooLong;

  const suppressOnceRef = useRef(false);

  useEffect(() => {
    if (suppressOnceRef.current) {
      suppressOnceRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const v = validateTaskTitle(title);
      if (!loading) setErr(v.ok ? '' : v.message);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [title, loading]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validateTaskTitle(title);
    if (!v.ok) {
      setErr(v.message);
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    setLoading(true);
    setErr('');
    try {
      await onAdd(v.value);
      setTitle('');
      suppressOnceRef.current = true;
      setToast('Tạo task thành công');
    } catch (e) {
      setErr(e?.message || 'Tạo task thất bại');
      setToast('Tạo task thất bại');
      requestAnimationFrame(() => inputRef.current?.focus());
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề task..."
          maxLength={TITLE_MAX + 50}
          aria-invalid={isInvalid ? 'true' : undefined}
          aria-describedby={err ? 'title-help title-error' : 'title-help'}
          className={styles.input}
        />
        <button
          type="submit"
          disabled={isInvalid || loading}
          aria-disabled={isInvalid || loading ? 'true' : undefined}
          className={styles.button}
          data-disabled={isInvalid || loading ? 'true' : 'false'}
        >
          {loading ? 'Đang thêm...' : 'Thêm'}
        </button>
      </div>

      <div id="title-help" className={`${styles.help} ${tooLong ? styles.helpDanger : ''}`}>
        {len}/{TITLE_MAX} {tooLong ? '— Vượt quá giới hạn' : ''}
      </div>

      <p id="title-error" role="alert" aria-live="assertive" className={styles.errorArea}>
        {err || ''}
      </p>

      {toast && (
        <div role="status" aria-live="polite" className={styles.toast}>
          {toast}
        </div>
      )}
    </form>
  );
}

export default TaskForm;
