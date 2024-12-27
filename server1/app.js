require('dotenv').config();
const express = require('express');
const path = require('path');
const oauthRoutes = require('./routes/oauth');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setting up views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/oauth', oauthRoutes);

// Root Route
app.get('/', (req, res) => {
    res.render('index');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server 1 running at http://localhost:${PORT}`);
});

