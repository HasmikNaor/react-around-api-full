const User = require('../models/user');

const userErrorHandler = (err, req, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).send({ message: err.message });
  }
  if (err.name === 'UserNotFoundError') {
    return res.status(404).send({ message: err.message });
  }

  return res.status(500).send({ message: err.message });
};

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
    .catch((err) => userErrorHandler(err, req, res));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => userNotFoundHandler())
    .then((user) => res.status(200).send(user))
    .catch((err) => userErrorHandler(err, req, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => userErrorHandler(err, req, res));
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
    .catch((err) => userErrorHandler(err, req, res));
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
    .catch((err) => userErrorHandler(err, req, res));
};
