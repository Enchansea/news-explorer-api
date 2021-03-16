const express = require('express');

const articleRouter = express.Router();

const {
    getSavedArticles,
    addArticle,
    removeArticle,

} = require('../controllers/articles');

articleRouter.get('/articles', getSavedArticles);
articleRouter.post('/articles', addArticle);
articleRouter.delete('/articles/articleId', removeArticle)

module.exports = articleRouter;