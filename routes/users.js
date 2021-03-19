const express = require('express');

const userRouter = express.Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
}), getCurrentUser);

module.exports = userRouter;
