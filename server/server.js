import express from 'express';
import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Phoenix API URLs
const phoenixURLs = {
  getBalance: 'http://127.0.0.1:9740/getbalance',
  getInfo: 'http://127.0.0.1:9740/getinfo',
  getLnAddress: 'http://127.0.0.1:9740/getlnaddress',
  listChannels: 'http://127.0.0.1:9740/listchannels',
  getOffer: 'http://127.0.0.1:9740/getoffer',
  createInvoice: 'http://127.0.0.1:9740/createinvoice',
  sendToAddress: 'http://127.0.0.1:9740/sendtoaddress',
  outgoingPayments: 'http://127.0.0.1:9740/payments/outgoing',
  incomingPayments: 'http://127.0.0.1:9740/payments/incoming',
  payInvoice: 'http://127.0.0.1:9740/payinvoice',
  payLnAddress: 'http://127.0.0.1:9740/paylnaddress',
  payOffer: 'http://127.0.0.1:9740/payoffer'

};

// Phoenix credentials
const username = ''; // Replace with your Phoenix username
const password = 'jesus'; // Replace with your Phoenix password
const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

// Function to fetch data from a specific Phoenix API endpoint
async function fetchData(url, method = 'GET', data = null) {
  try {
    const config = {
      headers: {
        'Authorization': authHeader,
        'Content-Type': data ? 'application/x-www-form-urlencoded' : undefined
      }
    };

    const response = method === 'POST'
      ? await axios.post(url, data, config)
      : await axios.get(url, config);

    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw new Error(`Failed to fetch data from ${url}`);
  }
}

// Route to fetch data from 'getbalance' endpoint
app.get('/api/getbalance', async (req, res) => {
  try {
    const data = await fetchData(phoenixURLs.getBalance);
    res.json({ data });
  } catch (error) {
    console.error('Error fetching getbalance data:', error);
    res.status(500).json({ error: 'Failed to fetch getbalance data' });
  }
});

// Route to pay an invoice
app.post('/api/payinvoice', async (req, res) => {
  try {
    const { amountSat, invoice } = req.body;

    if (!invoice) {
      return res.status(400).json({ error: 'Invoice is required' });
    }

    // Prepare data for the request
    const data = new URLSearchParams();
    if (amountSat) {
      data.append('amountSat', amountSat.toString());
    }
    data.append('invoice', invoice);

    // Send request to Phoenix API
    const response = await axios.post(phoenixURLs.payInvoice, data.toString(), {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Return the response from Phoenix API
    res.json(response.data);
  } catch (error) {
    console.error('Error paying invoice:', error);
    res.status(500).json({ error: 'Failed to pay invoice', details: error.message });
  }
});

// Route to pay an LN address
app.post('/api/paylnaddress', async (req, res) => {
  try {
    const { amountSat, address, message } = req.body;
    if (!amountSat || !address) {
      return res.status(400).json({ error: 'Amount and address are required' });
    }

    const data = new URLSearchParams({
      amountSat: amountSat.toString(),
      address: address,
      message: message || '' // Optional message
    }).toString();

    const result = await fetchData(phoenixURLs.payLnAddress, 'POST', data);
    res.json(result);
  } catch (error) {
    console.error('Error paying LN address:', error);
    res.status(500).json({ error: 'Failed to pay LN address' });
  }
});


// Route to pay an Bolt12 Offer
app.post('/api/payoffer', async (req, res) => {
  try {
    const { amountSat, offer, message } = req.body;
    if (!amountSat || !offer) {
      return res.status(400).json({ error: 'Amount and address are required' });
    }

    const data = new URLSearchParams({
      amountSat: amountSat.toString(),
      offer: offer,
      message: message || '' // Optional message
    }).toString();

    const result = await fetchData(phoenixURLs.payOffer, 'POST', data);
    res.json(result);
  } catch (error) {
    console.error('Error paying LN address:', error);
    res.status(500).json({ error: 'Failed to pay LN address' });
  }
});

// Route to fetch data from 'getinfo' endpoint
app.get('/api/getinfo', async (req, res) => {
  try {
    const data = await fetchData(phoenixURLs.getInfo);
    res.json({ data });
  } catch (error) {
    console.error('Error fetching getinfo data:', error);
    res.status(500).json({ error: 'Failed to fetch getinfo data' });
  }
});

// Route to fetch data from 'getlnaddress' endpoint
app.get('/api/getlnaddress', async (req, res) => {
  try {
    const data = await fetchData(phoenixURLs.getLnAddress);
    res.json({ data });
  } catch (error) {
    console.error('Error fetching getlnaddress data:', error);
    res.status(500).json({ error: 'Failed to fetch getlnaddress data' });
  }
});

// Route to fetch data from 'listchannels' endpoint
app.get('/api/listchannels', async (req, res) => {
  try {
    const data = await fetchData(phoenixURLs.listChannels);
    res.json({ data });
  } catch (error) {
    console.error('Error fetching listchannels data:', error);
    res.status(500).json({ error: 'Failed to fetch listchannels data' });
  }
});

// Route to fetch data from 'getoffer' endpoint
app.get('/api/getoffer', async (req, res) => {
  try {
    const data = await fetchData(phoenixURLs.getOffer);
    res.json({ data });
  } catch (error) {
    console.error('Error fetching getoffer data:', error);
    res.status(500).json({ error: 'Failed to fetch getoffer data' });
  }
});

// Route to create invoice
app.post('/api/createinvoice', async (req, res) => {
  try {
    const { description, amountSat } = req.body;
    const data = await fetchData(phoenixURLs.createInvoice, 'POST', { description, amountSat });
    res.json({ data });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Route to send to a Bitcoin address
app.post('/api/sendtoaddress', async (req, res) => {
  try {
    const { address, amountSat, feerateSatByte } = req.body;
    const data = await fetchData(phoenixURLs.sendToAddress, 'POST', { address, amountSat, feerateSatByte });
    res.json({ data });
  } catch (error) {
    console.error('Error sending to address:', error);
    res.status(500).json({ error: 'Failed to send to address' });
  }
});

// Route to fetch outgoing payments
app.get('/api/payments/outgoing', async (req, res) => {
  try {
    const data = await fetchData(phoenixURLs.outgoingPayments);
    res.json({ data });
  } catch (error) {
    console.error('Error fetching outgoing payments:', error);
    res.status(500).json({ error: 'Failed to fetch outgoing payments' });
  }
});

// Route to fetch incoming payments
app.get('/api/payments/incoming', async (req, res) => {
  try {
    const data = await fetchData(phoenixURLs.incomingPayments);
    res.json({ data });
  } catch (error) {
    console.error('Error fetching incoming payments:', error);
    res.status(500).json({ error: 'Failed to fetch incoming payments' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
