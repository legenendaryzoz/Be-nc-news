const { fetchArticleById } = require('../models/articles.model');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    fetchArticleById(article_id)
        .then((article) => {
            res.status(200).json({ article });
        })
        .catch((err) => {
            if (err.status === 404) {
                return res.status(404).json({ msg: 'Article not found' });
            }
            else{
                next(err);
            }
        });
};
