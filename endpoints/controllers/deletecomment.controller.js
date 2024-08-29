const {deleteComment} = require('../models/deletecomment.model');

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    deleteComment(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch(err => {
            next(err);
        });
};