// client/src/components/TaskForm.jsx
import { useState } from 'react';
import { validateTaskTitle, TITLE_MAX } from '../utils/validation';

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    // Dùng rule chung (trim + required + max 255)
    const v = validateTaskTitle(title);
    if (!v.ok) {
      setErr(v.message);
      return;
    }

    setLoading(true);
    setErr('');
    try {
      await onAdd(v.value);   // v.value đã được trim sạch
      setTitle('');           // reset input sau khi tạo thành công
    } catch (e) {
      setErr(e.message || 'Tạo task thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tiêu đề task..."
        // Cho phép nhập quá chút để còn nhìn bộ đếm ở bước sau; hiện tại có thể bỏ cũng được
        maxLength={TITLE_MAX + 50}
        style={{ flex: 1, padding: 8 }}
      />
      <button disabled={loading}>{loading ? 'Đang thêm...' : 'Thêm'}</button>
      {err && <span className="error" style={{ marginLeft: 8 }}>{err}</span>}
    </form>
  );
}

export default TaskForm;
