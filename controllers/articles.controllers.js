const fetchArticles = require('../models/articles.models')

const getArticles = (req, res)=> {
    fetchArticles()
    .then((articles)=> {
        res.status(200).send({articles})
    })
}

module.exports = getArticles