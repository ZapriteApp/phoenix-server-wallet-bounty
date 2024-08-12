const express = require('express');
const router = express.Router();
const apService = require('./apiService');

router.get('/get-balance', async (req, res) => {
    try  {
        const data = await apService.getBalance();
        res.json(data)
    }
    catch(error) {
        res.status(500).json({ message: 'Error retreving data'})
    }
})

module.exports = router;