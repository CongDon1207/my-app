// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Tạo pool MySQL (đọc từ .env)
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "myapp",
  waitForConnections: true,
  connectionLimit: 10,
});

// Route thử nghiệm
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Node.js API" });
});

// GET /api/tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, done, created_at FROM tasks ORDER BY id DESC"
    );
    const data = rows.map((r) => ({ ...r, done: !!r.done }));
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

//POST /api/tasks
app.post("/api/tasks", async (req, res) => {
  const { title } = req.body || {};
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "title is required" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO tasks (title) VALUES (?)",
      [title.trim()]
    );
    const insertId = result.insertId;

    const [rows] = await pool.query(
      "SELECT id, title, done, created_at FROM tasks WHERE id = ?",
      [insertId]
    );
    const row = rows[0];
    row.done = !!row.done;
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

// PATCH /api/tasks/:id - toggle hoặc đặt done theo body { done: true|false }
app.patch("/api/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const { done } = req.body ?? {};

  try {
    let result;
    if (done === undefined) {
      // Không truyền done -> toggle
      [result] = await pool.query("UPDATE tasks SET done = 1 - done WHERE id = ?", [id]);
    } else {
      // Truyền done rõ ràng -> set theo giá trị
      const val = done ? 1 : 0;
      [result] = await pool.query("UPDATE tasks SET done = ? WHERE id = ?", [val, id]);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const [rows] = await pool.query(
      "SELECT id, title, done, created_at FROM tasks WHERE id = ?",
      [id]
    );
    if (!rows[0]) {
      return res.status(404).json({ error: "Task not found" });
    }
    const row = rows[0];
    row.done = !!row.done;
    return res.json(row);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "DB error" });
  }
});


// DELETE /api/tasks/:id - xoá task theo id
app.delete("/api/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(204).send(); // No Content
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "DB error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
