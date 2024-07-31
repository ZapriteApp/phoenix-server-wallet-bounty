const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware to serve static files
app.use(express.static('public'));

// Endpoint to interact with Phoenix Server
app.get('/api/balance', async (req, res) => {
  try {
    const response = await axios.get('http://phoenixd:port/balance');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching balance');
  }
});

app.listen(port, () => {
  console.log(`Lightning wallet UI app listening at http://localhost:${port}`);
});
