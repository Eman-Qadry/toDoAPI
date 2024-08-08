// isAuth.js
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const isAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const err = new Error('You are not logged in! Please log in to get access.');
    err.statusCode = 401;
    return next(err);
  }

  try {
    console.log('Token:',token); // Log the token
    console.log('JWT_SECRET:',process.env.JWT_SECRET); // Log the secret
    const decodedToken = await promisify(jwt.verify)(token, "yoursecretcode");
    console.log('Decoded Token:', decodedToken); // Log the decoded token

    if (!decodedToken) {
      const err = new Error('Not Authorized yet!');
      err.statusCode = 401;
      return next(err);
    }

    req.userId = decodedToken._id;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    err.statusCode = 500;
    return next(err);
  }
};

module.exports = isAuth;
