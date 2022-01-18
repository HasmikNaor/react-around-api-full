const Card = require('../models/card');


const cardNotFoundHandler = () => {
  const error = new Error('document not found');
  error.statusCode = 404;
  error.name = 'UserNotFoundError';
  throw error;
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => cardNotFoundHandler())
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  console.log('createcard controller', req.user)
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card)
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .orFail(() => cardNotFoundHandler())
    .then((card) => res.status(201).send(card))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .orFail(() => cardNotFoundHandler())
    .then((card) => res.status(201).send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .orFail(() => cardNotFoundHandler())
    .then((card) => res.status(201).send(card))
    .catch(next);
};
