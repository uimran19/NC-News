const express = require('express')
const app = express()
const endpoints = require('./endpoints.json')
const getTopics = require('./controllers/topics.controllers')
const getArticles = require('./controllers/articles.controllers')
const getUsers = require('./controllers/users.controllers')
const getArticleById = require('./controllers/getArticleById.controllers')
const {
    handlePsqlErrors,
    handleCustomErrors,
    handleServerErrors
} = require('./errors')

app.get('/api', (req, res)=> {
    res.status(200).send({endpoints})
})

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/users', getUsers)

app.get('/api/articles/:article_id', getArticleById)


app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handleServerErrors)

module.exports = app