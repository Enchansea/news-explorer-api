const express = require('express');

const userRouter = express.Router();

const {
    getCurrentUser
} = require('../controllers/users');

userRouter.get('/users/me', getCurrentUser);

module.exports.userRouter;