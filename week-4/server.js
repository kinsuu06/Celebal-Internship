const express = require('express');
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the Express Home Page!');
});

app.get('/about', (req, res) => {
  res.send('This is the About Page!');
});

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
