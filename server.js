const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;
const { Buffer } = require('buffer')
require('dotenv').config();
const path = require('path');

const corsOptions = {
  origin: 'http://127.0.0.1:9740', 
  methods: 'GET,POST,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
};

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(cors(corsOptions));

app.use('/views', express.static(path.join(__dirname, 'views')));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home', (req, res) => {
  res.render('dashboard');
});



app.get('/api/getbalance', async (req, res) => {
  const url = 'http://127.0.0.1:9740/getbalance';
  const username = ''; 
  const httpPassword = process.env.HTTP_PASSWORD;

  const headers = {
    'Authorization': 'Basic ' + Buffer.from(`${username}:${httpPassword}`).toString('base64')
  
  }

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching balance: ' + error.message });
    
  }
});

// Endpoint to interact with Phoenix Server
app.get('/api/balance', async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:9740/getBalance');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching balance');
  }
});

app.listen(port, () => {
  console.log(`Lightning wallet UI app listening at http://localhost:${port}`);
});
