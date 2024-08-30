import express from 'express';
import * as apiService from './apiService.js';
const router = express.Router();

router.get('/get-balance', async (req, res) => {
    try  {
        const data = await apiService.getBalance();
        res.json(data);
    }
    catch(error) {
        console.log("error happened here")
        res.status(500).json({ message: 'Error retreving balance'});
    }
});

router.post('/pay-invoice', async(req, res) => {
    const { amountSat, invoice } = req.body;
    try {
        const data = await apiService.payInvoice(amountSat, invoice);
        res.json(data);
    }catch(error) {
        res.status(500).json({message: 'Error paying invoice'});
    }
});

router.get('/get-node-info', async(req, res) => {
    try {
        const data = await apiService.getNodeInfo();
        res.json(data);
    }catch(error) {
        res.status(500).json({message: 'Error paying getting node information'});
    }
});

router.post('/create-invoice', async(req, res) => {
    const { description, amountSat, externalId, webhookUrl } = req.body;
    try {
        const data = await apiService.createInvoice(description, amountSat, externalId, webhookUrl);
        res.json(data);
    }catch(error) {
        res.status(500).json({message: 'Error paying invoice'});
    }
});

router.get('/outgoing-payments', async(req, res) => {
    const { from, to, limit, offset, all } = req.body;
    try {
        const data = await apiService.getOutgoingPayments(from, to, limit, offset, all);
        res.json(data);
    }catch(error) {
        res.status(500).json({message: 'Error fetching payments'});
    }
});

router.get('/incoming-payments', async(req, res) => {
    const { from, to, limit, offset, all } = req.body;
    try {
        const data = await apiService.getIncomingPayments(from, to, limit, offset, all);
        res.json(data);
    }catch(error) {
        res.status(500).json({message: 'Error fetching payments'});
    }
});

router.post('/pay-offer', async(req, res) => {
    const { amountSat, offer, message } = req.body;
    try {
        const data = await apiService.payOffer(amountSat, offer, message);
        res.json(data);
    }catch(error) {
        res.status(500).json({message: 'Error paying offer'});
    }
});

router.get('/get-offer', async (req, res) => {
    try  {
        const data = await apiService.getOffer();
        res.json(data);
    }
    catch(error) {
        res.status(500).json({ message: 'Error retreving offer'});
    }
});

router.get('/list-incoming-and-outgoing', async (req, res) => {
    try  {
        const data = await apiService.listIncomingAndOutgoing();
        res.json(data);
    }
    catch(error) {
        res.status(500).json({ message: 'Error retreving transactions'});
    }
});

router.post('/decode-offer', async (req, res) => {
    const { offer } = req.body;    
    try  {
        const data = await apiService.decodeOffer(offer);
        res.json(data);
    }
    catch(error) {
        res.status(500).json({ message: 'Error decoding offer'});
    }
});

router.post('/decode-invoice', async (req, res) => {
    const { invoice } = req.body;
    try  {
        const data = await apiService.decodeInvoice(invoice);
        res.json(data);
    }
    catch(error) {
        res.status(500).json({ message: 'Error decoding invoice'});
    }
});

export default router;