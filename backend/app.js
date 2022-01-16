const mongoose = require('mongoose');
const express = require('express');
const auth = require('./middleware/auth');
const { requestLogger, errorLogger } = require('./middleware/logger')
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const validator = require('validator');
const { errors } = require('celebrate');
const UserNotFoundErr = require('./errors/user-not-found-error.js');
const OtherError = require('./errors/other-error.js');
const ValidationError = require('./errors/validation-error.js');
const CastError = require('./errors/cast-error.js');
var cors = require('cors');

mongoose.connect('mongodb://localhost:27017/aroundb');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;


app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
})

app.use(cors());
app.options('*', cors()); //enable requests for all routes 

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error('string.uri');
}

app.use(requestLogger); // enabling the request logger

// app.use(cors());
// app.options('*', cors()); //enable requests for all routes 

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL)
  })
}),
  createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required(),
  })
}), login);

app.use(auth);

app.use(usersRoutes);
app.use(cardsRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'The requested resource was not found' });
});

app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler

app.use((err, req, res, next) => {
  let error = new OtherError(err.message);
  console.log(err.name)
  if (err.name === 'CastError') {
    error = new CastError(err.message);
  }
  else if (err.name === 'ValidationError') {
    error = new ValidationError(err.message);
  }
  else if (err.name === 'UserNotFoundError') {
    error = new UserNotFoundErr(err.message);
  }
  else if (err.name === 'AuthError') {
    error = err;
  }
  return res.status(error.statusCode).send({ name: err.name, message: error.message });
});

app.listen(PORT);
