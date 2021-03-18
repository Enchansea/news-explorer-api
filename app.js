const express = require('express');

const app = express();
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/newsb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('/', userRouter);
app.use('/', articleRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
