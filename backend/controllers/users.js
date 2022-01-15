const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const userNotFoundHandler = () => {
  const error = new Error('document not found');
  error.statusCode = 404;
  error.name = 'UserNotFoundError';
  throw error;
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail(() => userNotFoundHandler())
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => userNotFoundHandler())
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      name,
      about,
      avatar,
      email,
      password: hash
    }))
    .then((user) => res.status(201).send(user))
    .catch(next);
};

module.exports.updateProfile = (req, res) => {
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

module.exports.updateAvatar = (req, res) => {
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

module.exports.getCurrentUser = (req, res) => {
  const id = req.user._id;
  console.log(req)
  User.find({ _id: id })
    .orFail(() => userNotFoundHandler())
    .then((user) => res.status(201).send(user))
    .catch(next);
}

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }
      );
      res.send({ token });
    })
    .catch(next);
}


