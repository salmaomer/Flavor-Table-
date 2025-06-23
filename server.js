require("dotenv").config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

//Random page
const homerandom = require('./routes/Rrecipes');
app.use('/Recipes', homerandom);
app.get('/randoms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'random.html'));
});

//Search page
const homesearch = require('./routes/Srecipes');
app.use('/Recipe', homesearch);
app.get('/searchs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

//Favorite page
app.get('/favorites', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favorite.html'));
});

//Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//------------------------------------
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

//------------------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
