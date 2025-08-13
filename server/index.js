// server/index.js
const express = require('express');
const cors = require('cors');
const path = require('path')
const Database = require('better-sqlite3')

const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const db = new Database(path.join(__dirname, 'data.db'))

// Đọc và chạy file seed.sql
db.exec('DELETE FROM tasks; VACUUM;');
const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
db.exec(seedSQL);
console.log('✅ Seed data đã được nạp từ seed.sql');

// Middleware
app.use(cors()); // Cho phép mọi domain gọi API
app.use(express.json()); // Đọc dữ liệu JSON từ body





// Route thử nghiệm
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js API' });
});

app.get('/api/tasks', (req, res) => {
    const rows = db.prepare('SELECT id, title, done, created_at FROM tasks ORDER BY id DESC').all();
    const data = rows.map(r => ({ ...r, done: !!r.done}));
    res.json(data);
})

app.post('/api/tasks', (req, res) => {
    const {title} = req.body || {};
    if(!title || !title.trim()) {
        return res.status(400).json({error : 'title is required'});
    }

    const info = db
        .prepare('INSERT INTO tasks (title) VALUES (?)')
        .run(title.trim())

        // Lấy task vừa thêm để trả lại
    const row = db
        .prepare('SELECT id, title, done, created_at FROM tasks WHERE id = ?')
        .get(info.lastInsertRowid);

    row.done = !!row.done; // chuyển 0/1 -> boolean
    res.status(201).json(row);
})

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
