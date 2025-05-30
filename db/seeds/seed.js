const db = require("../connection")
const devData = require('../data/test-data')
const testData = require('../data/test-data')
const format = require('pg-format')
const {
  convertTimestampToDate,
  createLookUpObject
} = require('../seeds/utils')

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments;`)
  .then(()=> {
    return db.query(`DROP TABLE IF EXISTS articles;`)
  }).then(()=> {
    return db.query(`DROP TABLE IF EXISTS topics;`)
  }).then(()=> {
    return db.query('DROP TABLE IF EXISTS users;')
  }).then(()=> {
    return db.query(`CREATE TABLE topics (
      slug VARCHAR(300) PRIMARY KEY,
      description VARCHAR(300),
      img_url VARCHAR(1000));`
    ); 
  }).then(()=> {
    return db.query(`CREATE TABLE users (
      username VARCHAR(100) PRIMARY KEY,
      name VARCHAR(50),
      avatar_url VARCHAR(1000));`)
  }).then(()=> {
    return db.query(`CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(100),
      topic VARCHAR(300) REFERENCES topics(slug) ON DELETE SET NULL,
      author VARCHAR(100) REFERENCES users(username) ON DELETE SET NULL,
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000));`)
  }).then(()=> {
    return db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id) ON DELETE SET NULL,
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(100) REFERENCES users(username) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`)
  }).then(()=> {
      const formattedValues = topicData.map(({slug, description, img_url})=> {
        return [slug, description, img_url]
      })
      const sqlString = format(`INSERT INTO topics(slug, description, img_url) VALUES %L`, formattedValues)
      return db.query(sqlString)
  }).then(()=> {
    const formattedValues = userData.map(({username, name, avatar_url})=> {
      return [username, name, avatar_url]
    })
    const sqlString = format(`INSERT INTO users(username, name, avatar_url) VALUES %L`, formattedValues)
    return db.query(sqlString)
  }).then(()=> {
    const formattedArticles = articleData.map(convertTimestampToDate)
    const formattedValues = formattedArticles.map(({title, topic, author, body, created_at, votes, article_img_url})=> {
      return [title, topic, author, body, created_at, votes, article_img_url]
    })
    const sqlString = format(`INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`, formattedValues)
    return db.query(sqlString)
  }).then(({rows})=> {
    console.log(rows)
    const formattedComments = commentData.map(convertTimestampToDate)
    const articleLookupObj = createLookUpObject(rows, 'title', 'article_id')
    const formattedValues = formattedComments.map(({article_title, body, votes, author, created_at})=> {
      return [articleLookupObj[article_title], body, votes, author, created_at]
    })
    const sqlString = format(`INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L`, formattedValues)
    return db.query(sqlString)
  })
  
};
module.exports = seed;
