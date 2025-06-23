const {
    fetchArticles,
    updateArticle
} = require('../models/articles.models')

const {fetchArticleById} = require('../models/fetchArticleById.models')

const getArticles = (req, res)=> {
    fetchArticles()
    .then((articles)=> {
        res.status(200).send({articles})
    })
}

const patchArticle = (req, res, next) => {
    const article_id = req.params.article_id
    const votes = req.body.inc_votes

    if (!Object.prototype.hasOwnProperty.call(req.body, 'inc_votes')) return Promise.reject({status: 400, msg: 'inc_votes key must be present'})
    
    Promise.all([fetchArticleById(article_id), updateArticle(article_id, votes)])
    .then(([fetchedArticle, article])=> {
        res.status(200).send({article})
    })
    .catch((err)=> {
        next(err)
    })
}

module.exports = {
    getArticles,
    patchArticle
}