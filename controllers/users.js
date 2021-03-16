const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const SALT_ROUND = 10;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user._doc);
      } else {
        throw new NotFoundError('user does not exist');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!password || !email || !name) {
    throw new BadRequestError('invalid data');
  }
  bcrypt.hash(password, SALT_ROUND)
    .then((hash) => {
      User.create({ email, password: hash, name })
        .then((user) => {
          if (!user) {
            throw new BadRequestError('invalid data');
          } res.status(201).send({
            _id: user._id,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.status(409).send({ message: err.message });
          }
          throw new BadRequestError('user cannot be created');
        });
    })
    .catch(next);
};

const login = (req, res, next) => {

}

module.exports = {
  getCurrentUser,
  createUser,
}