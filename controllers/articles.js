/* eslint-disable no-unused-vars */
const Article = require('../models/articleSchema');
const BadRequestError = require('../middleware/errors/BadRequestError');
const NotFoundError = require('../middleware/errors/NotFoundError');

// populate Articles
const getArticle = (req, res, next) => Article.find({})
  .then((article) => res.status(200).send(article))
  .catch((err) => res.status(500).send(err));

// create article
const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  console.log('createA', req.body);
  Article.create({ keyword, title, text, date, source, link, image, owner: req.user._id })
    .then((article) => {
      console.log('article', article);
      if (!article) {
        throw new BadRequestError('invalid data for creating article');
      }
      res.send(article);
    })
    .catch(next);
};

// delete article
const deleteArticle = (req, res, next) => {
  Article.findByIdAndRemove(req.params.articleID)
    .then((article) => {
      if (!article) {
        throw new NotFoundError('card not found');
      }
      res.send(article);
    })
    .catch(next);
};

module.exports = {
  getArticle,
  createArticle,
  deleteArticle,
};
