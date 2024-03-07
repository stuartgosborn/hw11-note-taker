const express = require('express');
const path = require('path');
const api = require('./routes/index');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

// Send all the requests that begin with /api to the index.js in the routes folder
app.use('/api', api);

// This view route is a GET route for the homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// This view route is a GET route for the feedback page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);




app.listen(PORT, () =>
  console.log(`Listening for requests at  http://localhost:${PORT} 🚀`)
);
