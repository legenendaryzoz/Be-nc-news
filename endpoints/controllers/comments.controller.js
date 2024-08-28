const { selectCommentsByArticleId } = require('../models/comments.model');

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    selectCommentsByArticleId(article_id)
        .then((comments) => {
            if (comments.length === 0) {
                return res.status(200).json({ comments: [] });
            } else {
                res.status(200).json({ comments });
            }
        })
        .catch((err) => {
            next(err);
        });
};
