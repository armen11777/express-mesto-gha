const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { reLink } = require('./utils/constants');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(reLink),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// app.use('/*', (req, res, next) => {
//   next(new NotFoundError('Страница не найдена'));
// });

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send(
    { message: statusCode === 500 ? 'На сервере произошла ошибка' : message },
  );
  next();
});
app.listen(PORT);
