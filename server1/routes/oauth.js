const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/authorize', async (req, res) => {
    try {
        const { client_id, client_secret, redirect_uri, scope } = req.body;

        // Send credentials to Server 2
        const response = await axios.post('http://localhost:5000/oauth/authorize', {
            client_id,
            client_secret,
            redirect_uri,
            scope,
        });

        // Receive Zoho's auth URL and display it to the user
        const { authorization_url } = response.data;
        res.redirect(authorization_url);
    } catch (error) {
        console.error('Error authorizing:', error.message);
        res.status(500).send('Error generating authorization URL.');
    }
});

router.get('/callback', (req, res) => {
    // Receive the authorization code from Server 2 and render it
    //const { code } = req.query;
    const authorizationCode = req.query.code;
    if (!authorizationCode) {
        return res.status(400).send('Authorization code is missing.');
    }

    res.render('callback', { authorizationCode});
});

module.exports = router;