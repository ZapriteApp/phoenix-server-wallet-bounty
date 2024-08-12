const axios = require('axios');
require('dotenv').config();

let baseUrl = process.env.PHOENIX_API_URL
const username = ''; 
const httpPassword = process.env.HTTP_PASSWORD;
const headers = {
    'Authorization': 'Basic ' + Buffer.from(`${username}:${httpPassword}`).toString('base64')
};

const getBalance = async () => {
    path = '/getbalance'
    url =  new URL(path, baseUrl).href;
    try {
        const response = await axios.get(url, { headers });
        return response.data;
      } catch (error) {
        console.error('Error fetching data', error);
        throw error;
      }
}

module.exports = { getBalance };