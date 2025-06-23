const db = require('../db/connection')

const fetchArticles = () => {
    return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id=articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC`)
        .then(({rows})=> {
            return rows
        })
}

const updateArticle = (article_id, votes) => {
    return db.query(`UPDATE articles
        SET
            votes = votes + $1
        WHERE article_id = $2
        RETURNING *
        `, [votes, article_id])
        .then(({rows})=> {
            return rows[0]
        })
}

module.exports = {fetchArticles, updateArticle}