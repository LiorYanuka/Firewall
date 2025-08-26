import winston from 'winston';
import { config } from './env';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// Format
const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    const logMessage = stack || message;
    return `${timestamp} [${level}]: ${logMessage} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

let transports: winston.transport[] = [];

// Configure transports based on environment
if (config.env === 'dev') {
  // Dev → log to console
  transports.push(
    new winston.transports.Console({
      level: 'debug', // log everything
      format: combine(colorize(), timestamp(), errors({ stack: true }), consoleFormat),
    })
  );
} else {
  // Prod → log to file
  transports.push(
    new winston.transports.File({
      filename: 'app.log',
      level: 'info', // only info+ messages
      format: combine(timestamp(), errors({ stack: true }), json()),
    })
  );
}

// Create the logger
const logger = winston.createLogger({
  defaultMeta: { service: 'firewall-service', env: config.env },
  transports,
});

// Graceful initialization: catch unexpected failures
try {
  logger.info(`Logger initialized in ${config.env} environment`);
} catch (e) {
  console.error('Logger failed to initialize', e);
}

console.log = (...args: any[]) => logger.info(args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));
console.warn = (...args: any[]) => logger.warn(args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));
console.error = (...args: any[]) => logger.error(args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));
console.debug = (...args: any[]) => logger.debug(args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));


export default logger;
