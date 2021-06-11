const router = require('express').Router();
const auth = require('../middleware/auth');
const NotFoundError = require('../middleware/errors/NotFoundError');
const {
    login, createUser
} = require('../controllers/users');
const articleRouter = require('./articles');
const userRouter = require('./users');
const { celebrate, Joi, errors } = require('celebrate');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
  
  
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth)
router.use('/users', userRouter);
router.use('/articles', articleRouter);
router.get('*', () => {
  throw new NotFoundError('requested resource not found');
});

module.exports = router;