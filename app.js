const express = require('express')
const app = express()
const endpoints = require('./endpoints.json')
const getTopics = require('./controllers/topics.controllers')
const getArticles = require('./controllers/articles.controllers')
const getUsers = require('./controllers/users.controllers')

app.get('/api', (req, res)=> {
    res.status(200).send({endpoints})
})

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/users', getUsers)

module.exports = app