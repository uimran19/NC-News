const {fetchArticleById} = require('../models/fetchArticleById.models')

const getArticleById = (req, res, next) => {
    fetchArticleById(req.params.article_id).then((article)=> {
        res.status(200).send({article})
    })
    .catch((err)=> {
        console.log(err)
        next(err)
    })
}

module.exports = getArticleById