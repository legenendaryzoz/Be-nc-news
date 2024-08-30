const { fetchArticles, checkTopicExists } = require('../models/article.model');

exports.getArticles = (req, res, next) => {
    const { topic, sort_by = 'created_at', order = 'desc' } = req.query;

    const validQueries = ['sort_by', 'order', 'topic'];
    const queryKeys = Object.keys(req.query);

    const invalidQueries = queryKeys.filter(key => !validQueries.includes(key));

    if (invalidQueries.length > 0) {
        return res.status(400).json({ msg: 'Invalid query' });
    }

    if (topic) {
        checkTopicExists(topic)
            .then(topicExists => {
                if (!topicExists) {
                    return res.status(404).json({ msg: 'No articles found for this topic' });
                }
                return fetchArticles(topic, sort_by, order);
            })
            .then(articles => {
                if (articles.length === 0) {
                    return res.status(200).json({ articles: [] });
                }
                const cleanedArticles = articles.map(({ body, ...rest }) => rest);
                res.status(200).json({ articles: cleanedArticles });
            })
            .catch(next);
    } else {
        fetchArticles(null, sort_by, order)
            .then(articles => {
                const cleanedArticles = articles.map(({ body, ...rest }) => rest);
                res.status(200).json({ articles: cleanedArticles });
            })
            .catch(next);
    }
};
