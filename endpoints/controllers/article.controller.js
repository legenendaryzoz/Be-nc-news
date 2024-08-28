// article.controller.js
const { fetchArticles } = require('../models/article.model');

exports.getArticles = (req, res, next) => {
  const validQueries = ['author', 'topic', 'sort_by', 'order'];
  const queryKeys = Object.keys(req.query);

  const invalidQueries = queryKeys.filter(key => !validQueries.includes(key));

  if (invalidQueries.length > 0) {
    return res.status(400).json({ msg: 'Invalid query' });
  }

  fetchArticles()
    .then(articles => {
      const cleanedArticles = articles.map(({ body, ...rest }) => rest);
      res.status(200).json({ articles: cleanedArticles });
    })
    .catch(next);
};
