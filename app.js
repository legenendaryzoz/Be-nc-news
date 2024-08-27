const express = require('express');
const {getTopics} = require('./endpoints/controllers/topics.controller');
const {getEndpoints} = require('./endpoints/controllers/api.controller');
const app = express();

app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint not found' });
  });

module.exports = app;
