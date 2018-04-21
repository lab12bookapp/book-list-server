'use strict';
require('dotenv').config();

// Application dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');

// Application Setup
const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Application Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// API Endpoints
app.get('/api/v1/books', (req, res) => {
  client.query('SELECT * FROM books;')
    .then(results => res.send(results.rows))
    .catch(console.error);
});
app.get('/api/v1/books/:id', (req, res) => {
  client.query(`SELECT * FROM books WHERE book_id=${req.params.id};`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.post('/api/v1/books', (req, res) => {
  client.query(
    `INSERT INTO
      books(title, author, image_url, isbn, description)
      VALUES('${req.body.title}, ${req.body.author}, ${req.body.image_url}, ${req.body.isbn}, ${req.body.description}');
    `)
    .then(() => res.sendStatus(200))
    .catch(err => res.sendStatus(500));
});
app.put('/api/v1/books/:id', (req, res) => {
  client.query(`
    UPDATE books 
    SET title = '${req.body.title}', 
        author = '${req.body.author}', 
        image_url = '${req.body.image_url}', 
        isbn = '${req.body.isbn}', 
        description = '${req.body.description}');
    `)
    .then(() => res.sendStatus(200))
    .catch(err => res.sendStatus(500));
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
