const { insertComment } = require('../models/postcomments.model');
const { fetchArticleById } = require('../models/articles.model');
const { fetchUserByUsername } = require('../models/users.model');

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    if (!username) {
        return res.status(400).send({ msg: 'Missing required fields' });
    }

    if (body.trim() === '') {
        return res.status(400).send({ msg: 'Comment body cannot be empty' });
    }

    if (isNaN(article_id)) {
        return res.status(400).send({ msg: 'Invalid article ID' });
    }

    fetchArticleById(article_id)
        .then((article) => {
            if (!article) {
                return Promise.reject({ status: 404, msg: 'Article not found' });
            }
            return fetchUserByUsername(username)
                .then((user) => {
                    if (!user) {
                        return Promise.reject({ status: 404, msg: 'Username not found' });
                    }
                    return insertComment(article_id, username, body);
                });
        })
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
};
