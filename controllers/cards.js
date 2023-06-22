const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;
  Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      }
    });
};

const deleteCard = (req, res, next) => {
  console.log('sadlmsemlf')
  Card.findById(req.params.cardId)
    .then((card) => {
      console.log(card)
      if (card === null) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
        return;
      }
      if (card.owner === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((cardDelete) => {
            res.send({ data: cardDelete });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new BadRequestError(err.message));
            }
          });
      }
      throw new NotFoundError('Карточка с указанным _id не найдена')
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(err.message));
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(err.message));
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
