import winston from 'winston';
import { config } from './env';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// Format
const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    const logMessage = stack || message;
    return `${timestamp} [${level}]: ${logMessage} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

let transports: winston.transport[] = [];

if (config.env === 'dev') {
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: combine(colorize(), timestamp(), errors({ stack: true }), consoleFormat),
    })
  );
} else {
  transports.push(
    new winston.transports.File({
      filename: 'app.log',
      level: 'info',
      format: combine(timestamp(), errors({ stack: true }), json()),
    })
  );
}

const logger = winston.createLogger({
  defaultMeta: { service: 'firewall-service', env: config.env },
  transports,
});

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
