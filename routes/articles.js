const articleRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getArticle,
  createArticle,
  deleteArticle,

} = require('../controllers/articles');

articleRouter.get('/', getArticle);

articleRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().uri(),
    image: Joi.string().required().uri(),
  }),
}), createArticle);
// articleRouter.post('/articles', createArticle);

articleRouter.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().required(),
  }),
}), deleteArticle);
// articleRouter.delete('/articles/articleId', deleteArticle);

module.exports = articleRouter;
