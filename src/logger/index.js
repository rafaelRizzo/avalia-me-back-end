import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.DEBUG_STATUS === 'production' ? 'error' : 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'avaliacao-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log', level: 'info' }),
  ],
});

if (process.env.DEBUG_STATUS !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
