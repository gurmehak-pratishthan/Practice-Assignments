const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create user
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    const insertedId = result.insertId;
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [insertedId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Get user by id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
