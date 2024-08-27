const express = require('express');
const {getTopics} = require('./endpoints/controllers/topics.controller');
const app = express();

app.get('/api/topics', getTopics);

// Error handling for invalid paths
app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Not Found' });
});

module.exports = app;
