require("dotenv").config(); 

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.static('public'));

//Random page
const homerandom = require('./routes/recipes');
app.use('/Recipes', homerandom);
app.get('/randoms', (req, res) => {
  res.sendFile(__dirname + '/public/random.html');
});


// const homesearch = require('./routes/Srecipes');
// app.use('/Recipe', homesearch);

const API_KEY = process.env.API_KEY;

app.get('/Recipe/Search', async (req, res) => {
    const ingredients = req.query.ingredients;

    try {
      res.sendFile(__dirname + '/public/js/searchapp.js');
        
    } catch (err) {
        console.error('API Error:', err.message);
        res.status(500).send('Error fetching data from Spoonacular API');
    }
});

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/public/search.html');
});




app.use((req ,res) =>{
  res.status(404).send('Page Not Found');
  //res.status(404).send("<a href='/'> back </a>");
  //res.redirect('/home'); 
});



//--------------------------------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
    /* This Callback Function Is Executed Once The Server Starts Successfully */
  console.log(`Example app listening on port ${port}`)
});

