// server/routes/tasks.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { validateIdParam, validateTitle } = require('../middlewares/validate');

// GET /api/tasks
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, done, created_at FROM tasks ORDER BY id DESC'
    );
    res.json(rows.map(r => ({ ...r, done: !!r.done })));
  } catch (e) { next(e); }
});

// POST /api/tasks
router.post('/', validateTitle, async (req, res, next) => {
  try {
    const [result] = await pool.query('INSERT INTO tasks (title) VALUES (?)', [req.body.title]);
    const [rows] = await pool.query(
      'SELECT id, title, done, created_at FROM tasks WHERE id = ?',
      [result.insertId]
    );
    const row = rows[0]; row.done = !!row.done;
    res.status(201).json(row);
  } catch (e) { next(e); }
});

// PATCH /api/tasks/:id  (toggle nếu không gửi done; set nếu có)
router.patch('/:id', validateIdParam, async (req, res, next) => {
  const id = Number(req.params.id);
  const { done } = req.body ?? {};
  try {
    let result;
    if (done === undefined) {
      [result] = await pool.query('UPDATE tasks SET done = 1 - done WHERE id = ?', [id]);
    } else {
      [result] = await pool.query('UPDATE tasks SET done = ? WHERE id = ?', [done ? 1 : 0, id]);
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });

    const [rows] = await pool.query('SELECT id, title, done, created_at FROM tasks WHERE id = ?', [id]);
    const row = rows[0]; row.done = !!row.done;
    res.json(row);
  } catch (e) { next(e); }
});

// DELETE /api/tasks/:id
router.delete('/:id', validateIdParam, async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
