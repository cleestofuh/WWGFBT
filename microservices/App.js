'use strict';
const express = require('express')
const yelp = require('yelp-fusion');

var authToken = 'bFm3YYpZhis8RWtyXW2I1zISEXjB96y_h6fiqyzkvkVhV3idjgOxdiuDKPrL-5dEVivHRI5P0La57xGOkK7VTtv250OX9T8eU4_8vXUSXXck2QxB6vDhNQHD2g8jXHYx'
const client = yelp.client(authToken);

// Set up the express app
const app = express();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Global Vars
app.get('/getShops', (req, res) => {
    client.search({
        categories: req.query.category,
        location: req.query.location,
        limit: 50,
    }).then(response => {
        // Sending return message
        res.status(200).send({
            success: 'true',
            message: 'shops retrieved successfully',
            data: response.jsonBody.businesses,
        })
    }).catch(e => {
        res.status(500).send({
            success: 'false',
            message: JSON.parse(e.response.body)
        })
    });
});

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
