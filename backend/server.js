// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // db.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const authenticate = (req, res, next) => {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Signup
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'All fields required' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const q = 'INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING id, username, email';
    const { rows } = await pool.query(q, [username, email, hashed]);
    const user = rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Email exists' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (!rows[0]) return res.status(400).json({ message: 'Invalid credentials' });
  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

// CRUD todos (protected)
app.post('/api/todos', authenticate, async (req, res) => {
  const { title, description, status } = req.body;
  const q = 'INSERT INTO todos (user_id, title, description, status) VALUES ($1,$2,$3,$4) RETURNING *';
  const { rows } = await pool.query(q, [req.user.id, title, description || null, status || 'pending']);
  res.status(201).json(rows[0]);
});

app.get('/api/todos', authenticate, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM todos WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
  res.json(rows);
});

app.put('/api/todos/:id', authenticate, async (req, res) => {
  const { title, description, status } = req.body;
  const q = `UPDATE todos SET title=$1, description=$2, status=$3 WHERE id=$4 AND user_id=$5 RETURNING *`;
  const { rows } = await pool.query(q, [title, description, status, req.params.id, req.user.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Not found' });
  res.json(rows[0]);
});

app.delete('/api/todos/:id', authenticate, async (req, res) => {
  await pool.query('DELETE FROM todos WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ message: 'Deleted' });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT}`));
