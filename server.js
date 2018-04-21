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

app.get('*', (req, res) => res.redirect(CLIENT_URL));

// app.post('/books', (request, response) => {
//   client.query(
//     `INSERT INTO
//     books(title, author, image_url, isbn, description)
//     VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING;
//     `,
//     [
//       request.body.title,
//       request.body.author,
//       request.body.image_url,
//       request.body.isbn,
//       request.body.description
//     ]
//   )
//     .then(function() {
//       response.send('insert complete')
//     })
//     .catch(function(err) {
//       console.error(err);
//     });



// function queryTwo() {
//   client.query(
//     `SELECT book_id FROM books WHERE title=$1;`,
//     [request.body.title],
//     function(err, result) {
//       if (err) console.error(err);
//       // REVIEW: This is our third query, to be executed when the second is complete. We are also passing the author_id into our third query.
//       queryThree(result.rows[0].book_id);
//     }
//   )
// }
// }



app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
