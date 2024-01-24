const jwt = require('jsonwebtoken');
const config = require('../config/default.json');  // Update the path based on your project structure

const auth = (req, res, next) => {
  // Get the token from the request header
  const token = req.header('x-auth-token');

  // Check if the token is present
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Attach the user object to the request for future use
    req.user = decoded;

    // Move to the next middleware
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;