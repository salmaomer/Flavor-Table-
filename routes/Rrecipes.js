const express = require('express');
const axios = require('axios');

const Routerss = express.Router();


Routerss.get('/Random', async (req, res) => {
  try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/random?apiKey=${process.env.API_KEY}&number=50`);
      res.json(response.data);
      console.log(response.data);
      
    } catch (e) {
      console.error('Error fetching data:', e.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = Routerss;