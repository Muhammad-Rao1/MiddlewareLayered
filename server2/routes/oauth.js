const { render } = require('ejs');
const express = require('express');
const axios = require('axios');

const router = express.Router();
const { ZOHO_AUTH_URL, REDIRECT_URI,ZOHO_TOKEN_URL } = process.env;

router.post('/authorize', (req, res) => {
    const { client_id, client_secret, redirect_uri, scope } = req.body;

    if (!client_id || !client_secret || !redirect_uri || !scope) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }
     //render('showrecievedcred',{ client_id, client_secret, redirect_uri, scope }) ;
    // Construct Zoho's authorization URL
    const authUrl = `${ZOHO_AUTH_URL}?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${REDIRECT_URI}&access_type=offline`;
    res.json({ authorization_url: authUrl });

});

router.get('/callback', (req, res) => {
    const authorizationCode = req.query.code;
    const location= req.query.location;
    const accounts = req.query['accounts-server'];
    //  const {code,location,accounts} = req.body;
   // const accounts = req.query.accounts-server;
   // const accounts = req.get('accounts-server');
    //const accserver = req.params(accounts-server);
    //const accserver = req.params(accounts-server);
    
   // if (!authorizationCode) {
   //     return res.status(400).send('Authorization code is missing.');
   // }

    // Redirect to Server 1 with the authorization code
    res.redirect(`http://localhost:4000/oauth/callback?code=${ authorizationCode}&location=${location}&accounts-server=${accounts}`);

  // res.render('displaycode', { authorizationCode,location});
   // res.render('displaycode', { authorizationCode,location,accounts});
  
   //res.render('displaycode', { authorizationCode,location,accserver});

});

router.post('/get-tokens', async (req, res) => {
    try {
        const { authorizationCode,client_id,client_secret} = req.body;

        // Make POST request to Zoho's token endpoint
        const tokenResponse = await axios.post(ZOHO_TOKEN_URL, null, {
            params: {
                client_id: client_id,
                client_secret: client_secret,
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: REDIRECT_URI,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Send tokens back to Server 1
        res.json(tokenResponse.data);
    } catch (error) {
        console.error('Error exchanging authorization code for tokens:', error.message);
        res.status(500).json({ error: 'Failed to retrieve tokens.' });
    }
});
module.exports = router;
