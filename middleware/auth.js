const jwt = require('jsonwebtoken');
const UnauthorizedError = require('./errors/UnauthorizedError');

// const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('authorization required');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-secret-code');
  } catch (err) {
    throw new UnauthorizedError('authorization required');
  }
  req.user = payload; // adding payload to the Request object
  next(); // passing request
};
// NODE_ENV === 'production' ? JWT_SECRET : 'Fd5Ic7sEcREtcOde'
