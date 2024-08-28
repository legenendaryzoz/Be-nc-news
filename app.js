const express = require('express');
const {getTopics} = require('./endpoints/controllers/topics.controller');
const {getEndpoints} = require('./endpoints/controllers/api.controller');
const {getArticleById} = require('./endpoints/controllers/articles.controller');
const { getArticles } = require('./endpoints/controllers/article.controller');
const app = express();

app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint not found' });
  });

  app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid article ID' });
    } else {
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});


module.exports = app;
