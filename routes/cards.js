const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/^https?:\/\/(www\.)?[a-z0-9._~:/?#]+#?/).required(),
  }),
}), createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
