const jwt = require('jsonwebtoken');
const { middlewareLogger } = require('../config/logger')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    const decoded = jwt.verify(token, process.env.SS_SECRET);
    req.userData = decoded
    next();
  } catch (error) {
    middlewareLogger.error('Authentication failed', { error });
    return res.status(401).json({
      error: 'Authentication failed',
    });
  }
}
