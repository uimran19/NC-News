const {fetchCommentsForArticle} = require('../models/fetchCommentsForArticle.models')
const {fetchArticleById} = require('../models/fetchArticleById.models')

const getCommentsForArticle = (req, res, next)=> {
    const article_id = req.params.article_id
    Promise.all([fetchArticleById(article_id),fetchCommentsForArticle(article_id)])
    .then(([article, comments])=> {
        res.status(200).send({comments})
    })
    .catch((err)=> {
        next(err)
    })
}

module.exports = getCommentsForArticle