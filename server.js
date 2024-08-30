import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './api/apiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
let url = process.env.PHOENIX_API_URL
const port = 3000;
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
  res.render('dashboard');
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home', (req, res) => {
  res.render('dashboard');
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Lightning wallet UI app listening at http://localhost:${port}`);
});


