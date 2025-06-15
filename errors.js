

exports.handlePsqlErrors = (err, req, res, next)=> {
    if (err.code === '22P02') {
        res.status(400).send({msg: 'Invalid input'})
    }
    if (err.code === '23503') {
        res.status(400).send({msg: 'user does not exist'})
    }
    next(err)
}


exports.handleCustomErrors = (err, req, res, next)=> {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
}


exports.handleServerErrors = (err, req, res, next)=> {
    res.status(500).send('Internal Server Error')
}

