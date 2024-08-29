const { fetchSortedArticles } = require('../models/sortedarticles.model');

exports.getSortedArticles = (req, res, next) => {
    const { sort_by = 'created_at', order = 'desc' } = req.query;
    const validQueries = ['sort_by', 'order'];
    const queryKeys = Object.keys(req.query);

    const invalidQueries = queryKeys.filter(key => !validQueries.includes(key));

    if (invalidQueries.length > 0) {
        return res.status(400).json({ msg: 'Invalid query' });
    }

    fetchSortedArticles(sort_by, order)
        .then(articles => {
            res.status(200).json({ articles });
        })
        .catch(next);
};
