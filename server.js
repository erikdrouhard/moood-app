import express from 'express';
import sqlite3Pkg from 'sqlite3';
import cors from 'cors';

const sqlite3 = sqlite3Pkg.verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('data.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT
  )`);
});



app.get('/entries', (req, res) => {
  db.all('SELECT * FROM entries', (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json(rows.map(r => JSON.parse(r.data)));
  });
});

app.post('/entries', (req, res) => {
  const data = JSON.stringify(req.body);
  db.run('INSERT INTO entries(data) VALUES(?)', [data], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ id: this.lastID });
  });
});

app.delete('/entries', (req, res) => {
  const { date } = req.body;
  db.run("DELETE FROM entries WHERE json_extract(data, '$.date') = ?", [date], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ deleted: this.changes });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
