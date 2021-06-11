/* eslint-disable no-unused-vars */
const Article = require('../models/articleSchema');
const BadRequestError = require('../middleware/errors/BadRequestError');
const NotFoundError = require('../middleware/errors/NotFoundError');
const ForbiddenError = require('../middleware/errors/ForbiddenError');

// populate Articles
const getArticle = (req, res, next) => {
  Article.find({})
    .then((article) => res.status(200).send(article))
    .catch((err) => res.status(500).send(err));
};
// create article
const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  if (!keyword || !title || !text || !date || !source || !link) {
    throw new BadRequestError('invalid data for creating article');
  }
  Article.create({ keyword, title, text, date, source, link, image, owner: req.user._id })
    .then((article) => {
      if (!article) {
        throw new BadRequestError('invalid data for creating article');
      }
      res.send(article);
    })
    .catch(next);
};

// delete article
const deleteArticle = (req, res, next) => {
  Article.findByIdAndRemove(req.params.articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundError('article not found');
      }
      if (String(article.owner) !== req.user._id) {
        throw new ForbiddenError('unauthorized');
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
