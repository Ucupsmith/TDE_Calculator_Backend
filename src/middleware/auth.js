import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded;
    next();
    console.log('Token authenticated successfully:', decoded);
  } catch (error) {
    console.error('Error in authenticateToken middleware:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired. Please login again.',
        error: 'TOKEN_EXPIRED'
      });
    }
    return res.status(403).json({
      status: 'error',
      message: 'Invalid token.'
    });
  }
};
