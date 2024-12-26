const express = require('express');
const router = express.Router();
const { ZOHO_AUTH_URL, REDIRECT_URI } = process.env;

router.post('/authorize', (req, res) => {
    const { client_id, client_secret, redirect_uri, scope } = req.body;

    if (!client_id || !client_secret || !redirect_uri || !scope) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Construct Zoho's authorization URL
    const authUrl = `${ZOHO_AUTH_URL}?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${REDIRECT_URI}&access_type=offline`;
    res.json({ authorization_url: authUrl });
});

router.get('/callback', (req, res) => {
    const authorizationCode = req.query.code;

    if (!authorizationCode) {
        return res.status(400).send('Authorization code is missing.');
    }

    // Redirect to Server 1 with the authorization code
    res.redirect(`http://localhost:4000/oauth/callback?code=${authorizationCode}`);
});

module.exports = router;
