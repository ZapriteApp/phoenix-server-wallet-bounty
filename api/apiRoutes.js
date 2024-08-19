const express = require('express');
const router = express.Router();
const apService = require('./apiService');

router.get('/get-balance', async (req, res) => {
    try  {
        const data = await apService.getBalance();
        res.json(data);
    }
    catch(error) {
        res.status(500).json({ message: 'Error retreving balance'});
    }
})

router.post('/pay-invoice', async(req, res) => {
    const { amountSat, invoice } = req.body;
    try {
        const data = await apService.payInvoice(amountSat, invoice);
        res.json(data);
    }catch(error) {
        res.status(500).json({message: 'Error paying invoice'});
    }
})

router.get('/get-node-info', async(req, res) => {
    try {
        const data = await apService.getNodeInfo();
        res.json(data);
    }catch(error) {
        res.status(500).json({message: 'Error paying getting node information'});
    }
})

router.post('/create-invoice', async(req, res) => {
    const { description, amountSat, externalId, webhookUrl } = req.body;
    try {
        const data = await apService.payInvoice(description, amountSat, externalId, webhookUrl);
        res.json(data);
    }catch(error) {
        res.status(500).json({message: 'Error paying invoice'});
    }
})


module.exports = router;