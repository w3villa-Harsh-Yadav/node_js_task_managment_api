// const winston = require('winston')
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint, printf } = format;

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        prettyPrint(),
        printf(info => `${info.level}:${[info.timestamp]}: ${info.message}`),
    ),
    transports: [
      new transports.File({ filename: './logs/error.log', level: 'error' }),
      new transports.File({ filename: './logs/combined.log' }),
    ],
});


module.exports = logger;
