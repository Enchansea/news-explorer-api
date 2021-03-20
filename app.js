/* eslint-disable no-unused-vars */
require('dotenv').config(); // load enviornment variables from .env file into process.env
const express = require('express'); // node.js web app framework
const cors = require('cors'); // cross-origin resource sharing.

const app = express();
const mongoose = require('mongoose'); // object data modeling
const helmet = require('helmet'); // secure HTTP headers
const { celebrate, Joi, errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const auth = require('./middleware/auth');

const { PORT = 3000 } = process.env;
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./middleware/errors/NotFoundError');

mongoose.connect('mongodb://localhost:27017/newsb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Basic rate-limiting middleware. Limit repeated req to API's endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowsMs
});

app.use(cors());
app.options('*', cors()); // allow all headers
app.use(express.json()); // parse json bodies through express
app.use(express.urlencoded({ extended: true })); // parse url-encoded bodies
app.use(requestLogger);
app.use(helmet());
app.use(limiter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/', userRouter);
app.use('/', articleRouter);
app.get('*', () => {
  throw new NotFoundError('requested resource not found');
});
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // check status and display message
      message: statusCode === 500 ? 'An error occured on the server' : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
