import express from 'express';
import sqlite3Pkg from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const sqlite3 = sqlite3Pkg.verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('data.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    data TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

const SECRET = 'change_this_secret';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users(username, password) VALUES(?, ?)', [username, hashed], function(err) {
    if (err) return res.status(400).json({ error: 'User exists' });
    const token = jwt.sign({ id: this.lastID }, SECRET);
    res.json({ token });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err || !row) return res.status(401).json({ error: 'Invalid' });
    if (!bcrypt.compareSync(password, row.password)) return res.status(401).json({ error: 'Invalid' });
    const token = jwt.sign({ id: row.id }, SECRET);
    res.json({ token });
  });
});

app.get('/entries', authMiddleware, (req, res) => {
  db.all('SELECT * FROM entries WHERE user_id = ?', [req.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json(rows.map(r => JSON.parse(r.data)));
  });
});

app.post('/entries', authMiddleware, (req, res) => {
  const data = JSON.stringify(req.body);
  db.run('INSERT INTO entries(user_id, data) VALUES(?, ?)', [req.userId, data], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ id: this.lastID });
  });
});

app.delete('/entries', authMiddleware, (req, res) => {
  const { date } = req.body;
  db.run("DELETE FROM entries WHERE user_id = ? AND json_extract(data, '$.date') = ?", [req.userId, date], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ deleted: this.changes });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
