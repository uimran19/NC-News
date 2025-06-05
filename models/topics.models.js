const db = require('../db/connection')

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({rows})=> {
        console.log(rows)
        return rows
    })
}

module.exports = {fetchTopics}