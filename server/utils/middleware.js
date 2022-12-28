const logger = require('./logger');

const requestLogger = (request, _, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownInput = (_, res) =>
  res.status(404).send({ error: 'unknown endpoint' });

const errorHandler = (error, _, res, next) => {
  ({
    CastError: () => res.status(400).send({ error: 'mal formatted id' }),
    ValidationError: () => res.status(400).send({ error: error.message }),
    JsonWebTokenError: () => res.status(401).json({ error: 'invalid token' })
  }[error.name]);

  logger.error('\x1b[31m%s\x1b[0m', error.message);

  next(error);
};

module.exports = {
  requestLogger,
  unknownInput,
  errorHandler
};
