const { createLogger, format, transports, config } = require('winston');
const { combine, timestamp, json } = format;
 
const userLogger = createLogger({
  defaultMeta: {
    component: 'userController',
  },
  format: combine(
    timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    json()
  ),
   transports: [
       new transports.Console(),
       new transports.File({ filename: 'combined.log' }),
     ]
 });

 const middlewareLogger = createLogger({
  defaultMeta: {
    component: 'middleware',
  },
  format: combine(
    timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    json()
  ),
   transports: [
       new transports.Console(),
       new transports.File({ filename: 'combined.log' }),
     ]
 });

 module.exports = {
  userLogger,
  middlewareLogger
 };
