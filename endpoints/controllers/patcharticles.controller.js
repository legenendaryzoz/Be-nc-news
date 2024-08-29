const { updateArticleVotes } = require('../models/patcharticles.model');

exports.patchArticleVotes = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    if (typeof inc_votes !== 'number') {
        return res.status(400).send({ msg: 'Missing or invalid inc_votes field' });
    }

    if (isNaN(article_id)) {
        const error = new Error('Invalid article ID');
        error.status = 400;
        return next(error);
    }

    updateArticleVotes(article_id, inc_votes)
        .then((updatedArticle) => {
            res.status(200).send({ article: updatedArticle });
        })
        .catch(next);
};
