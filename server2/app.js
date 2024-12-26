require('dotenv').config();
const express = require('express');
const oauthRoutes = require('./routes/oauth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/oauth', oauthRoutes);

// Root Route
app.get('/', (req, res) => {
    res.render('index');
});

// Starts server
app.listen(PORT, () => {
    console.log(`Server 2 running at http://localhost:${PORT}`);
});
