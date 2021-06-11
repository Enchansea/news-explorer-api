/* eslint-disable no-unused-vars */
require('dotenv').config(); // load enviornment variables from .env file into process.env
const express = require('express'); // node.js web app framework
const cors = require('cors'); // cross-origin resource sharing.

const app = express();
const mongoose = require('mongoose'); // object data modeling
const helmet = require('helmet'); // secure HTTP headers
const rateLimit = require('express-rate-limit');

const { NODE_ENV, MONGO_URL, PORT = 3000 } = process.env;
const indexRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middleware/logger');
const NotFoundError = require('./middleware/errors/NotFoundError');

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/newsb', {
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

app.use('/', indexRouter);
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
