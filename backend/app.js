const mongoose = require('mongoose');
const validator = require('validator');
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cors = require('cors');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { createUser, login } = require('./controllers/users');

const ResourceNotFoundErr = require('./errors/resource-not-found-error');

mongoose.connect('mongodb://localhost:27017/aroundb');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());

// const corsOptions = {
//   origin: '*',
//   credentials: true, // access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };

app.use(cors());
app.options('*', cors()); // enable requests for all routes

// app.use((req, res, next) => {
//   const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
//   const requestHeaders = req.headers['access-control-request-headers'];
//   const { method } = req;
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Credentials", "true");

//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     // return res.end();
//   }

//   next();
// });

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

app.use(requestLogger); // enabling the request logger

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
    // name: Joi.string().min(2).max(30),
    // about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use(usersRoutes);
app.use(cardsRoutes);

app.use((req, res, next) => {
  next(new ResourceNotFoundErr('resource not found'));
});

app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler

app.use((err, req, res, next) => {
  return res.status(err.statusCode).send({ name: err.name, message: err.message });
});

app.listen(PORT);
