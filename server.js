const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;
const { Buffer } = require('buffer')
require('dotenv').config();
const path = require('path');
const apiRoutes = require('./api/apiRoutes')
require('dotenv').config();

let url = process.env.PHOENIX_API_URL

const corsOptions = {
  origin: url, 
  methods: 'GET,POST,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
};

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use('/views', express.static(path.join(__dirname, 'views')));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home', (req, res) => {
  res.render('dashboard');
});

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Lightning wallet UI app listening at http://localhost:${port}`);
});


