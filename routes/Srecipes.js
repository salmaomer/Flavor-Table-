const express = require('express');
const axios = require('axios');

const Routerss = express.Router();

Routerss.get('/Search', async (req, res) => {
  try {
    const ingredientsParam = req.query.q;

    if (!ingredientsParam) {
      return res.status(400).json({ error: 'No ingredients provided' });
    }

    const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.API_KEY}&ingredients=${ingredientsParam}&number=50`;

    const response = await axios.get(url);

    res.json(response.data);

  } catch (e) {
    console.error('Error fetching data:', e.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = Routerss;
