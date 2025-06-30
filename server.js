
require("dotenv").config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json()); 

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

//SQL
const pg = require("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL});

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

//Routes SQL
const SQLcrud = require('./routes/CRUD');
app.use('/recipes',SQLcrud);




//------------------------------------
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

//------------------------------------
const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


pool.connect()
  .then((client) => {
    return client
      .query("SELECT current_database(), current_user")
      .then((res) => {
        client.release();

        const dbName = res.rows[0].current_database;
        const dbUser = res.rows[0].current_user;

        console.log(
          `Connected to PostgreSQL as user '${dbUser}' on database '${dbName}'`
        );

        console.log(`App listening on port http://localhost:${port}`);
      });
  })
  .then(() => {
    app.listen(port);
  })
  .catch((err) => {
    console.error("Could not connect to database:", err);
  });
