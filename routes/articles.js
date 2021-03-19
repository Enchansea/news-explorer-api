const articleRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getArticle,
  createArticle,
  deleteArticle,

} = require('../controllers/articles');

articleRouter.get('/articles', getArticle);

articleRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().uri(),
    image: Joi.string().required().uri(),
  }),
}), createArticle);
// articleRouter.post('/articles', createArticle);

articleRouter.delete('/articles/articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24).required(),
  }),
}), deleteArticle);
// articleRouter.delete('/articles/articleId', deleteArticle);

module.exports = articleRouter;
