const db = require('../../db/connection');

exports.fetchArticles = (topic, sort_by = 'created_at', order = 'desc') => {
    const validSortBy = ['author', 'title', 'topic', 'created_at', 'votes'];
    const validOrder = ['asc', 'desc'];

    if (!validSortBy.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort column' });
    }

    if (!validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order' });
    }

    let queryStr = `
        SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
    `;

    const queryParams = [];

    if (topic) {
        queryStr += ` WHERE articles.topic = $1`;
        queryParams.push(topic);
    }

    queryStr += `
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};
    `;

    return db.query(queryStr, queryParams).then(({ rows }) => {
        return rows;
    });
};

exports.checkTopicExists = (topic) => {
    return db
        .query('SELECT * FROM topics WHERE slug = $1', [topic])
        .then(({ rows }) => {
            return rows.length > 0;
        });
};
