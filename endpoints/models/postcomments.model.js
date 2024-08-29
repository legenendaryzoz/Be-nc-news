const db = require('../../db/connection');

exports.insertComment = (article_id, username, body) => {
    return db
        .query(
            `INSERT INTO comments (article_id, author, body, votes)
             VALUES ($1, $2, $3, 0)
             RETURNING *;`,
            [article_id, username, body]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
