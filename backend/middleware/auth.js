const jwt = require('jsonwebtoken');
require('dotenv').config();
const { NODE_ENV, JWT_SECRET } = process.env;
const AuthError = require('../errors/auth-error.js');

module.exports = (req, res, next) => {
  const { Authorization } = req.headers;

  const Authorization = req.headers.Authorization
  const err = new AuthError('Authorization problem');
  console.log(req.headers, 'auth')
  if (!Authorization || !Authorization.startsWith('Bearer ')) {
    console.log('if1')
    next(err);
    return;
  }

  const token = Authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'); // verifying the token
  } catch (e) {
    console.log('if2')
    next(err);
    return;
  }
  req.user = payload; //This will ensure that the next middleware can see for whom this request was executed

  next();
}; 