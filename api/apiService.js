const axios = require('axios');
require('dotenv').config();

let baseUrl = process.env.PHOENIX_API_URL
const username = '';
const httpPassword = process.env.HTTP_PASSWORD;
const headers = {
  'Authorization': 'Basic ' + Buffer.from(`${username}:${httpPassword}`).toString('base64')
};

const getBalance = async () => {
  path = '/getbalance';
  url = new URL(path, baseUrl).href;
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
}

const payInvoice = async (amountSat, invoice) => {
  const path = '/payinvoice';
  const url = new URL(path, baseUrl).href;

  const data = new URLSearchParams();
  data.append('amountSat', amountSat);
  data.append('invoice', invoice);

  try {
    const response = await axios.post(url, data.toString(), { headers });
    return response.data;
    
  }catch(error) {
    console.error("Error paying invoice", error)
    throw error
  }
}

const getNodeInfo = async () => {
  path = '/getinfo';
  url = new URL(path, baseUrl).href;
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
}

const createInvoice = async (description, amountSat, externalId, webhookUrl) => {
  path = '/createinvoice';
  url = new URL(path, baseUrl).href;

  const data = new URLSearchParams();
  data.append('description', description);
  data.append('amountSat', amountSat);
  data.append('extranlID', externalId);
  data.append('webhookUrl', webhookUrl);

  try{
    const response = await axios.post(url, { headers });
    return response.data
  }catch(error){
    console.error('Error creating invoice:', error );
  }
}

module.exports = { getBalance, payInvoice, getNodeInfo, createInvoice};