const config = require('../config/config');
const logger = require('../config/logger');

exports.auth = function auth(req, res, next) {
  if (config.hash !== undefined) {
    let hash = req.query.hash;

    hash = (typeof hash === 'undefined') ? '' : hash;

    if(hash != config.hash) {
      res.statusCode = 401;
      res.end('Not authorized');
      return;
    }
  }

  next();
};