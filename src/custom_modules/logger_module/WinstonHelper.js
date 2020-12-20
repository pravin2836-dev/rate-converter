const dateFormate = require('../util_module/utils').dateFormate;
var filePathName = require(process.cwd() + '/package.json');
const { createLogger, format, transports } = require('winston');
const { environment } = require('../../../environments');
const fs = require('fs');
const logDir = 'logs';
const stage = environment.stage;
var logger;

if (stage === 'local') {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  const errorFilename = `${process.cwd()}/logs/${filePathName.name}` + 'Error.' + `${dateFormate(Date.now(), 'DD_MM_YY')}.log`;
  const infoFilename = `${process.cwd()}/logs/${filePathName.name}` + 'Info.' + `${dateFormate(Date.now(), 'DD_MM_YY')}.log`;
  logger = createLogger({
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    ),
    transports: [
      new transports.File({
        level: 'info',
        filename: infoFilename,
        format: format.combine(
          format.printf(
            value =>
              `${value.timestamp} ${value.level} ${value.message}`
          )
        )
      }),
      new transports.Console({
        level: 'info',
        filename: infoFilename,
        format: format.combine(
          format.colorize(),
          format.printf(
            value =>
              `${value.timestamp} ${value.level} ${value.message}`
          )
        )
      }),
      new transports.File({
        filename: errorFilename,
        level: 'error',
        handleExceptions: true,
        json: true,
        format: format.combine(
          format.printf(
            value =>
              `${value.timestamp} ${value.level} ${value.message}`
          )
        )
      })
    ],

  });

} else {
  logger = createLogger({
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    ),
    transports: [
      new transports.Console({
        level: 'info',
        format: format.combine(
          format.colorize(),
          format.printf(
            value =>
              `${value.timestamp} ${value.level} ${value.message}`
          )
        )
      })
    ],

  });
}

logger.stream = {
  write: function (message, encoding) {
    console.log(encoding);
    if (message.includes(' 200 ') || message.includes(' 201 ') || message.includes(' 202 ') || message.includes(' 204 ')) {
      logger.info(message);
    } else {
      logger.error(message);
    }
  }
};

module.exports = logger;
