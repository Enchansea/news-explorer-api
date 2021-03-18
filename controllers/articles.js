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
  const { name, link } = req.body;
  Article.create({ name, link, owner: req.user._id })
    .then((article) => {
      if (!article) {
        // replace Error with middleware Error
        throw new BadRequestError('invalid data for creating article');
      }
      res.send(article);
    })
    .catch(next);
};

// delete article
const deleteArticle = (req, res, next) => {
  Article.findByIdAndRemove(req.params.cardID)
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
