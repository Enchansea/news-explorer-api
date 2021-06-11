const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), getCurrentUser);

module.exports = userRouter;
