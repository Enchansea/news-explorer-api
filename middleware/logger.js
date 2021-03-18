const winston = require('winston');
const expressWinston = require('express-winston');

// request logger - information written in request.log file
const requestLogger = expressWinston.logger({
  // transports is an array that you can write other destinations for your log
  transports: [
    new winston.transports.File({ filename: 'WinstonErrors/request.log' }),
  ],
  // specify json format because its easy to parse
  format: winston.format.json(),
});

// error logger - information written in error.log file
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'WinstonErrors/error.log' }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
