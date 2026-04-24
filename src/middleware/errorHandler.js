'use strict';
const logger = require('../config/logger');

// Express 4-arg error handler – must keep all 4 params
// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, _req, res, _next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message,
  });
};

