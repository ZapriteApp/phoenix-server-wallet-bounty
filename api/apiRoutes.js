import express from 'express';
import * as apiService from './apiService.js';
import * as utils from '../utils/utils.js'
import db from '../utils/db.js'
import bcrypt from 'bcrypt'
import path from 'path'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const httpPassword = process.env.HTTP_PASSWORD;

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
        console.log(error)
        if (error.res && error.res.status === 400) {
            res.json({ message: 'Invalid offer data. Please check and try again.' });
        } else {
            res.status(500).json({ message: 'An error occurred while decoding the offer.' });
        }

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

router.post('/save-contact', async (req, res) => {
    const { name, offer, address } = req.body;
    const newContactsId = utils.getId();
    try  {
        db.data.contacts.push({id: newContactsId, name:name, offer: offer, address: address})
        await db.write()
        res.json({message: "Contact saved successfully"});
    }
    catch(error) {
        console.log(error)
        res.status(500).json({ "message": error});
    }
});

router.get('/get-contacts', async (req, res) => {
    try  {
        const { contacts } = db.data
        res.json( { contacts } );
    }
    catch(error) {
        console.log(error)
        res.status(500).json({ "message": error});
    }
});


router.post('/save-password', async (req, res) => {
    const { password } = req.body;
    try  {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (db.data.password.length === 0) {
            db.data.password.push({ password: hashedPassword });
          } else {
            db.data.password[0].password = hashedPassword;
        }
        await db.write()
        res.json({message: "Password saved successfully"});
    }
    catch(error) {
        console.log(error)
        res.status(500).json({ "message": error});
    }
});

router.post('/is-password-set', async (req, res) => {
    try {
        const storedPassword = db.data?.password?.[0]?.password;
        if (match) {
            return res.json({ success: true, message: 'Password', token } );
        } else {
            return res.json({ success: false,  message: 'Password is not set' });
        }

    }catch(error) {
        console.error('Error checking password:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }    
});


router.post('/login', async (req, res) => {
    const { password } = req.body;
    const storedPassword = db.data.password[0].password; 

    try {
        const match = await bcrypt.compare(password, storedPassword);
        if (match) {

            const payload = { message: 'Authenticated successfully' };
            const token = jwt.sign(payload, httpPassword, { expiresIn: '1h' });
            return res.json({ success: true, message: 'Login successful', token } );
        } else {
            return res.json({ success: false,  message: 'Invalid password' });
        }

    }catch(error) {
        console.error('Error comparing passwords:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
    
});



router.get('/get-btc-price', async (req, res) => {
    try  {
     const btcPrice = await utils.getBitconPrice();
     res.json({ btcPrice: btcPrice })
    }
    catch(error) {
        console.log(error)
        res.status(500).json({ "message": error});
    }
});

router.get('/get-config-info', async (req, res) => {
    try  {
        const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.phoenix', 'phoenix.conf');
        const config = utils.readConfigFile(configPath);
        res.json({ config: config })
    }
    catch(error) {
        console.log(error)
        res.status(500).json({ "message": error});
    }
});

router.get('/is-password-set', (req, res) => {  
    try {
        const storedPassword = db.data?.password?.[0]?.password;
        if(!storedPassword){
            res.status(200).json({ success: false });

        }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(401).json({ success: false });
    }
});

router.get('/authenticate', (req, res) => {
    console.log("authenticating")
    const storedPassword = db.data?.password?.[0]?.password;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token required' });
    }  
    const token = authHeader.split(' ')[1];    
    try {
        if(!storedPassword){
            res.status(200).json({ success: true });

        }
      const user = jwt.verify(token, httpPassword);
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(401).json({ success: false });
    }
});




export default router;