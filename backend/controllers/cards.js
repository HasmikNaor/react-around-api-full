const Card = require('../models/card');

const cardErrorHandler = (err, req, res) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).send({ message: err.message });
  }
  if (err.name === 'UserNotFoundError') {
    return res.status(404).send({ message: err.message });
  }

  return res.status(500).send({ message: err.message });
};

const cardNotFoundHandler = () => {
  const error = new Error('document not found');
  error.statusCode = 404;
  error.name = 'UserNotFoundError';
  throw error;
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail(() => cardNotFoundHandler())
    .then((cards) => res.status(200).send(cards))
    .catch((err) => cardErrorHandler(err, req, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then((card) => res.status(201).send(card))
    .catch((err) => cardErrorHandler(err, req, res));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .orFail(() => cardNotFoundHandler())
    .then((card) => res.status(201).send(card))
    .catch((err) => cardErrorHandler(err, req, res));
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .orFail(() => cardNotFoundHandler())
    .then((card) => res.status(201).send(card))
    .catch((err) => cardErrorHandler(err, req, res));
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .orFail(() => cardNotFoundHandler())
    .then((card) => res.status(201).send(card))
    .catch((err) => cardErrorHandler(err, req, res));
};
