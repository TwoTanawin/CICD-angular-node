// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up SQLite database
const db = new sqlite3.Database(':memory:');

// Create movies table
db.serialize(() => {
    db.run("CREATE TABLE movies (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, director TEXT, year INTEGER)");
});

// Routes
app.get('/movies', (req, res) => {
    db.all("SELECT * FROM movies", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

app.post('/movies', (req, res) => {
    const { title, director, year } = req.body;
    db.run("INSERT INTO movies (title, director, year) VALUES (?, ?, ?)", [title, director, year], function(err) {
        if (err) {
            throw err;
        }
        res.json({ id: this.lastID, title, director, year });
    });
});

app.put('/movies/:id', (req, res) => {
    const { title, director, year } = req.body;
    db.run("UPDATE movies SET title = ?, director = ?, year = ? WHERE id = ?", [title, director, year, req.params.id], function(err) {
        if (err) {
            throw err;
        }
        res.json({ id: req.params.id, title, director, year });
    });
});

app.delete('/movies/:id', (req, res) => {
    db.run("DELETE FROM movies WHERE id = ?", req.params.id, function(err) {
        if (err) {
            throw err;
        }
        res.json({ message: 'Movie deleted' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
