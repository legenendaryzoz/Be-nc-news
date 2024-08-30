const db = require('../../db/connection');

exports.fetchArticleById = (article_id) => {
    return db.query(`
        SELECT articles.*, COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
    `, [article_id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' });
            }
            const article = result.rows[0];
            article.comment_count = Number(article.comment_count);
            return article;
        });
};
