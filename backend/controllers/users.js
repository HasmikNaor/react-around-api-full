const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const userNotFoundHandler = () => {
  const error = new Error('document not found');
  error.statusCode = 404;
  error.name = 'UserNotFoundError';
  throw error;
};
const emailAlreadyExists = () => {
  const error = new Error('choose another email');
  error.statusCode = 400;
  error.name = 'UserExists';
  throw error;
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => userNotFoundHandler())
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => userNotFoundHandler())
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const email = req.body.email;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return emailAlreadyExists();
      }
      return bcrypt.hash(req.body.password, 10)
        .then((hash) => User.create({
          email: req.body.email,
          password: hash,
        })
          .then((user) => {
            const {
              name,
              about,
              avatar,
              email,
              _id,
            } = user;
            res.status(201).send({
              name,
              about,
              avatar,
              email,
              _id,
            });
          }));
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .orFail(() => userNotFoundHandler())
    .then((user) => res.status(201).send(user))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(() => userNotFoundHandler())
    .then((user) => res.status(201).send(user))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const id = req.user._id; // req.user is payload
  User.find({ _id: id })
    .orFail(() => userNotFoundHandler())
    .then((user) => {
      res.status(201).send(user);
    })
    .catch(next);
};
// check to see if a user is in the database then create a token
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
