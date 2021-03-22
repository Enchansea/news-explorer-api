const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isEmail = require('validator/lib/isEmail');
const User = require('../models/userSchema');
const NotFoundError = require('../middleware/errors/NotFoundError');
const BadRequestError = require('../middleware/errors/BadRequestError');
const UnauthorizedError = require('../middleware/errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

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
  const { email, password } = req.body;
  if (!isEmail(email)) {
    throw new NotFoundError('incorrect email or password');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('incorrect email or password');
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
};
