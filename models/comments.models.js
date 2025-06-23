const db = require('../db/connection')

const deleteComment = (commentId) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [commentId])
    .then(({rows})=> {
        if (!rows[0]) return Promise.reject({status: 404, msg: `no comment found for comment_id ${commentId}`})
    })
}

module.exports = {deleteComment}