const {
    fetchCommentsForArticle,
    insertComment
} = require('../models/articles.comments.models')
const {fetchArticleById} = require('../models/fetchArticleById.models')

exports.getCommentsForArticle = (req, res, next)=> {
    const article_id = req.params.article_id
    Promise.all([fetchArticleById(article_id),fetchCommentsForArticle(article_id)])
    .then(([article, comments])=> {
        res.status(200).send({comments})
    })
    .catch((err)=> {
        next(err)
    })
}

exports.postCommentToArticle = (req, res, next)=> {
    const {username, body} = req.body
    if (!username || !body) {
        return Promise.reject({status: 400, msg: 'username and body must exist'})
    }
    const article_id = req.params.article_id
    Promise.all([fetchArticleById(article_id), insertComment(username, body, article_id)])
    .then(([article, comment])=> {
        res.status(201).send({comment})
    })
    .catch((err)=> {
        next(err)
    })
}