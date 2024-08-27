const path = require('path');
const fs = require('fs');
const endpointsPath = path.join(__dirname, '../../endpoints.json');

exports.getEndpoints = (req, res, next) => {
  fs.readFile(endpointsPath, 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }
    const endpoints = JSON.parse(data);
    res.status(200).json(endpoints);
  });
};
