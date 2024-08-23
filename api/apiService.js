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
  if (amountSat) {
    data.append('amountSat', amountSat);
  }
  data.append('invoice', invoice);


  try {
    const response = await axios.post(url, data.toString(), { headers });
    return response.data;

  } catch (error) {
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

  try {
    const response = await axios.post(url, data.toString(), { headers });
    return response.data
  } catch (error) {
    console.error('Error creating invoice:', error);
  }
}

const getIncomingPayments = async (from, to, limit, offset, all) => {
  path = '/payments/incoming';
  url = new URL(path, baseUrl).href;

  const params = {
    from: from,
    to: to,
    limit: limit,
    offset: offset,
    all: all
  }

  try {
    const response = await axios.get(url, {  params, headers });
    return response.data
  } catch (error) {
    console.error('Error fetching payments:', error);
  }
}


const getOutgoingPayments = async (from, to, limit, offset, all) => {
  path = '/payments/outgoing';
  url = new URL(path, baseUrl).href;
  const params = {
    from: from,
    to: to,
    limit: limit,
    offset: offset,
    all: all
  }

  try {
    const response = await axios.get(url, {  params, headers });
    return response.data
  } catch (error) {
    console.error('Error fetching payments:', error);
  }

}

const payOffer = async (amountSat, offer, message) => {
  const path = '/payoffer';
  const url = new URL(path, baseUrl).href;

  const data = new URLSearchParams();
  data.append('amountSat', amountSat);
  data.append('offer', offer);
  data.append('message', message);

  try {
    const response = await axios.post(url, data.toString(), { headers });
    return response.data;
  } catch (error) {
    console.error('Error paying offer:', error);
  }
};

const getOffer = async () => {
  path = '/getoffer';
  url = new URL(path, baseUrl).href;
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error getting data', error);
    throw error;
  }
}

const listIncomingAndOutgoing = async () => {
  path1 = '/payments/incoming?all=true&limit=1000000';
  path2 = '/payments/outgoing?all=true&limit=1000000';

  url1 = new URL(path1, baseUrl).href;
  url2 = new URL(path2, baseUrl).href;

  try {
    const response1 = await axios.get(url1, { headers });
    const response2 = await axios.get(url2, { headers });
    // const date = new Date(response1.data[0].createdAt);
    // return date.toString();
    
    // return [ ...response1.data, ...response2.data ]

    data = [ ...response1.data, ...response2.data ];

    return data.sort((a,b) => b.createdAt - a.createdAt)
    // return response1.data;
  } catch (error) {
    console.error('Error getting data', error);
    throw error;
  }

}

const decodeOffer = async (offer) => {
  path = '/decodeoffer';
  url = new URL(path, baseUrl).href;
  const data = new URLSearchParams();
  data.append('offer', offer);
  try {
    const response = await axios.post(url, data.toString(), { headers });
    return response.data;
  } catch (error) {
    console.error('Error decoding offer', error);
    throw error;
  }
}

const decodeInvoice = async (invoice) => {
  path = '/decodeinvoice';
  url = new URL(path, baseUrl).href;
  const data = new URLSearchParams();
  data.append('invoice', invoice);
  try {
    const response = await axios.post(url, data.toString(), { headers });
    return response.data;
  } catch (error) {
    console.error('Error decoding offer', error);
    throw error;
  }
}



module.exports = {
  getBalance, payInvoice, getNodeInfo, createInvoice,
  getIncomingPayments, getOutgoingPayments, payOffer, getOffer,
  listIncomingAndOutgoing, decodeInvoice, decodeOffer
};