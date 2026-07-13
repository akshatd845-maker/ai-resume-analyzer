const morgan = require('morgan');

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    skip: () => process.env.NODE_ENV === 'test',
  }
);

module.exports = morganMiddleware;