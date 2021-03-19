/* eslint-disable no-unused-vars */
require('dotenv').config(); // load enviornment variables from .env file into process.env
const express = require('express'); // node.js web app framework
const cors = require('cors'); // cross-origin resource sharing.

const app = express();
const mongoose = require('mongoose'); // object data modeling
const helmet = require('helmet'); // secure HTTP headers
const auth = require('./middleware/auth');
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./middleware/errors/NotFoundError');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/newsb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.options('*', cors()); // allow all headers
app.use(express.json()); // parse json bodies through express
app.use(express.urlencoded({ extended: true })); // parse url-encoded bodies
app.use(requestLogger);
app.use(helmet());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', userRouter);
app.use('/', articleRouter);
app.get('*', () => {
  throw new NotFoundError('requested resource not found');
});
app.use(errorLogger);

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
