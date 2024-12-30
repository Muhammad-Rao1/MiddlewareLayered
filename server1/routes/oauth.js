
const express = require('express');
const router = express.Router();
const axios = require('axios');

let userCredentials = {}; // Store user credentials temporarily

// Save credentials and generate Auth URL
router.post('/authorize', async (req, res) => {
    try {
        const { client_id, client_secret, redirect_uri, scope } = req.body;

        if (!client_id || !client_secret || !redirect_uri || !scope) {
            return res.status(400).send('All fields are required.');
        }

        // Save credentials
        userCredentials = { client_id, client_secret, redirect_uri };

        // Send credentials to Server 2
        const response = await axios.post('http://localhost:5000/oauth/authorize', {
            client_id,
            client_secret,
            redirect_uri,
            scope,
        });

        // Receive Zoho's Auth URL and display it to the user
        const { authorization_url } = response.data;
        res.redirect(authorization_url);
    } catch (error) {
        console.error('Error authorizing:', error.response?.data || error.message);
        res.status(500).send('Error generating authorization URL.');
    }
});

// Callback route to handle authorization code
router.get('/callback', (req, res) => {
    const authorizationCode = req.query.code;
    const location = req.query.location;
    const accounts = req.query['accounts-server'];

    if (!authorizationCode) {
        return res.status(400).send('Authorization code is missing.');
    }

    res.render('callback', { authorizationCode, location, accounts });
});

// Exchange authorization code for tokens
router.post('/get-tokens', async (req, res) => {
    try {
        const { authorizationCode, location, accounts } = req.body;

        // Ensure credentials are initialized
        const { client_id, client_secret, redirect_uri } = userCredentials;
        if (!client_id || !client_secret || !redirect_uri) {
            return res.status(400).send('Credentials are not initialized. Please authorize first.');
        }

        // Send authorization code and credentials to Server 2
        const response = await axios.post('http://localhost:5000/oauth/get-tokens', {
            authorizationCode,
            client_id,
            client_secret,
            redirect_uri,
        });

        // Extract and render tokens
        const { access_token, refresh_token, api_domain, token_type, expires_in } = response.data;
        res.render('token', {
            accessToken: access_token,
            refreshToken: refresh_token,
            tokenType: token_type,
            expiresIn: expires_in,
            apiDomain: api_domain,
        });
    } catch (error) {
        console.error('Error getting tokens:', error.response?.data || error.message);
        res.status(500).send('Error retrieving tokens.');
    }
});

module.exports = router;






