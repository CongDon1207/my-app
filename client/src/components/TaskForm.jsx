// client/src/components/TaskForm.jsx
import { useState } from 'react';

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setErr('Vui lòng nhập tiêu đề');
      return;
    }
    setLoading(true);
    setErr('');
    try {
      await onAdd(t);       // gọi hàm do App cung cấp
      setTitle('');         // reset input sau khi tạo thành công
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
        style={{ flex: 1, padding: 8 }}
      />
      <button disabled={loading}>{loading ? 'Đang thêm...' : 'Thêm'}</button>
      {err && <span className="error" style={{ marginLeft: 8 }}>{err}</span>}
    </form>
  );
}

export default TaskForm;
