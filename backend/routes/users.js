const express = require('express');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser
} = require('../controllers/users');
const ValidationError = require('../errors/validation-error');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}

router.get('/users/me', getCurrentUser);

router.get('/users', getUsers);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validateURL)
  })
}), updateAvatar);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  })
}), getUserById);

module.exports = router;
