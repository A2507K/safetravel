const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required. Please log in.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Authentication token is missing.'
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing from .env');

    return res.status(500).json({
      message: 'Server authentication configuration error.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({
        message: 'Invalid authentication token.'
      });
    }

    req.user = {
      userId: decoded.userId
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired authentication token. Please log in again.'
    });
  }
}

module.exports = authMiddleware;
