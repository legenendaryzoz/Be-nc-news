const db = require('../../db/connection');

exports.fetchSortedArticles = (sort_by = 'created_at', order = 'desc') => {
    const validSortBy = ['author', 'title', 'topic', 'created_at', 'votes'];
    const validOrder = ['asc', 'desc'];

    if (!validSortBy.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort column' });
    }

    if (!validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order' });
    }

    const queryStr = `
        SELECT articles.*, COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};`;

    return db.query(queryStr).then(({ rows }) => {
        return rows;
    });
};
