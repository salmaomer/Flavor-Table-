const express = require('express');
const axios = require('axios');

const Routers = express.Router();


/*Routers.get('/jjj', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/5');
    res.json(response.data);
    console.log(response.data);
  } catch (e) {
    console.error('Error fetching data:', e.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});*/

module.exports = Routers;