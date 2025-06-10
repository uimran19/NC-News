const express = require('express')
const app = express()
const endpoints = require('./endpoints.json')
const getTopics = require('./controllers/topics.controllers')
const getArticles = require('./controllers/articles.controllers')
const getUsers = require('./controllers/users.controllers')
const getArticleById = require('./controllers/getArticleById.controllers')
const {
    getCommentsForArticle,
    postCommentToArticle
} = require('./controllers/article.comments.controllers')
const {
    handlePsqlErrors,
    handleCustomErrors,
    handleServerErrors
} = require('./errors')

app.use(express.static('public'))
app.use(express.json())

app.get('/api', (req, res)=> {
    res.status(200).send({endpoints})
})

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/users', getUsers)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getCommentsForArticle)


app.post('/api/articles/:article_id/comments', postCommentToArticle)


app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)

module.exports = app