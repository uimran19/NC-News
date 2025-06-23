const {deleteComment} = require('../models/comments.models')

const removeComment = (req, res, next) => {
    const commentId = req.params.comment_id

    deleteComment(commentId).then(()=> {
        res.status(204).send()
    })
    .catch((err)=> {
        next(err)
    })

}

module.exports = {removeComment}