const express = require('express');
const {getTopics} = require('./endpoints/controllers/topics.controller');
const {getEndpoints} = require('./endpoints/controllers/api.controller');
const {getArticleById} = require('./endpoints/controllers/articles.controller');
const { getArticles } = require('./endpoints/controllers/article.controller');
const { getCommentsByArticleId } = require('./endpoints/controllers/comments.controller');
const{postComment} = require('./endpoints/controllers/postcomments.controller');
const { patchArticleVotes } = require('./endpoints/controllers/patcharticles.controller');
const {deleteCommentById} = require('./endpoints/controllers/deletecomment.controller');
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postComment);
app.patch('/api/articles/:article_id', patchArticleVotes);
app.delete('/api/comments/:comment_id', deleteCommentById);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint not found' });
  });

  app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else if (err.code === '22P02') {
        if (req.originalUrl.includes('/comments/')) {
            res.status(400).send({ msg: 'Invalid comment ID' });
        } else {
            res.status(400).send({ msg: 'Invalid article ID' });
        }
    } else {
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});


module.exports = app;
