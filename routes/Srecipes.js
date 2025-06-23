const express = require('express');
const axios = require('axios');

const Routerts = express.Router();


Routerts.get('/', async (req, res) => {
  try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.API_KEY}`);
      console.log("Response:", response);
      res.json(response.data);
      
    } catch (e) {
      console.error('Error fetching data:', e.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = Routerts;