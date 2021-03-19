const articleRouter = require('express').Router();

const {
  getArticle,
  createArticle,
  deleteArticle,

} = require('../controllers/articles');

articleRouter.get('/articles', getArticle);
articleRouter.post('/articles', createArticle);
articleRouter.delete('/articles/articleId', deleteArticle);

module.exports = articleRouter;
