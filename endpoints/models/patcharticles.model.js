const db = require('../../db/connection');

exports.updateArticleVotes = (article_id, inc_votes) => {
    return db.query(
        `UPDATE articles
         SET votes = votes + $1
         WHERE article_id = $2
         RETURNING *;`,
        [inc_votes, article_id]
    )
    .then(({ rows }) => {
        if (rows.length === 0) {
            const error = new Error('Article not found');
            error.status = 404;
            throw error;
        }
        return rows[0];
    });
};
