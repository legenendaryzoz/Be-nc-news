const { selectAllUsers } = require('../models/newusers.model');

exports.getAllUsers = (req, res, next) => {
    selectAllUsers()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(next);
};
