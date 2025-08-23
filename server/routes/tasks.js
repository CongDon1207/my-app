// server/routes/tasks.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, done, created_at FROM tasks ORDER BY id DESC'
    );
    const data = rows.map(r => ({ ...r, done: !!r.done }));
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error' });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  const { title } = req.body || {};
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO tasks (title) VALUES (?)',
      [title.trim()]
    );
    const insertId = result.insertId;
    const [rows] = await pool.query(
      'SELECT id, title, done, created_at FROM tasks WHERE id = ?',
      [insertId]
    );
    const row = rows[0];
    row.done = !!row.done;
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error' });
  }
});

// PATCH /api/tasks/:id  (toggle nếu không truyền done; set nếu có done)
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const { done } = req.body ?? {};
  try {
    let result;
    if (done === undefined) {
      [result] = await pool.query('UPDATE tasks SET done = 1 - done WHERE id = ?', [id]);
    } else {
      const val = done ? 1 : 0;
      [result] = await pool.query('UPDATE tasks SET done = ? WHERE id = ?', [val, id]);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const [rows] = await pool.query(
      'SELECT id, title, done, created_at FROM tasks WHERE id = ?',
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Task not found' });
    const row = rows[0];
    row.done = !!row.done;
    res.json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
