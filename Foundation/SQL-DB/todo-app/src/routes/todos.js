const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all todos. if ?include=user then return joined user data
router.get('/', async (req, res) => {
  try {
    if (req.query.include === 'user') {
      const [rows] = await pool.execute(`
        SELECT t.*, u.id AS user_id, u.name AS user_name, u.email AS user_email
        FROM todos t
        LEFT JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC
      `);
      return res.json(rows);
    }
    const [rows] = await pool.execute('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Get one todo
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Create todo
router.post('/', async (req, res) => {
  try {
    const { user_id = null, title, description = null, status = 'pending', priority = 2, due_date = null } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO todos (user_id, title, description, status, priority, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, title, description, status, priority, due_date]
    );
    const [rows] = await pool.execute('SELECT * FROM todos WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Update todo
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, status, priority, due_date, user_id } = req.body;
    // simple update (you can build dynamic queries to update only supplied fields)
    await pool.execute(
      `UPDATE todos SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, user_id = ? WHERE id = ?`,
      [title, description, status, priority, due_date, user_id, id]
    );
    const [rows] = await pool.execute('SELECT * FROM todos WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Delete todo
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await pool.execute('DELETE FROM todos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

/*
  Transaction example: mark multiple todos as done atomically.
  POST /todos/bulk-complete { ids: [1,2,3] }
*/
router.post('/bulk-complete', async (req, res) => {
  const ids = req.body.ids;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array required' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const id of ids) {
      await conn.execute('UPDATE todos SET status = ? WHERE id = ?', ['done', id]);
    }
    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    console.error('Transaction error', err);
    res.status(500).json({ error: 'Transaction failed' });
  } finally {
    conn.release();
  }
});

module.exports = router;

