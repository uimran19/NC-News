const endpointsJson = require("../endpoints.json");
const db = require('../db/connection')
const data = require('../db/data/test-data/index')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const app = require('../app')
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
beforeEach(()=> {
  return seed(data)
})

afterAll(()=> {
  return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe('GET /api/topics', () => {
  test('200: Responds with an object with a key of topics and value of array of topic objects', () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({body})=> {
      const {topics} = body
      expect(topics.length).not.toBe(0)
      topics.forEach(({slug, description, img_url})=> {
        expect(typeof slug).toBe('string')
        expect(typeof description).toBe('string')
        expect(typeof img_url).toBe('string')
      })
    })
  });
});

describe('GET /api/articles', () => {
  test('200: Responds with an object with a key of articles and value of array of article objects', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body})=> {
      const {articles} = body
      expect(articles.length).not.toBe(0)
      articles.forEach((article)=> {
        expect(typeof article.article_id).toBe('number')
        expect(typeof article.title).toBe('string')
        expect(typeof article.topic).toBe('string')
        expect(typeof article.author).toBe('string')
        expect(article).not.toHaveProperty('body')
        expect(typeof article.created_at).toBe('string')
        expect(typeof article.article_img_url).toBe('string')
        expect(typeof article.comment_count).toBe('number')
      })
    })
  });
})

describe('GET /api/users', () => {
  test('200: Responds with an object with a key of users and value of array of users', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({body})=> {
      const {users} = body
      expect(users.length).not.toBe(0)
      users.forEach(({username, name, avatar_url})=> {
        expect(typeof username).toBe('string')
        expect(typeof name).toBe('string')
        expect(typeof avatar_url).toBe('string')
      })
    })
  });
})

describe('GET /api/articles/:article_id', () => {
  test('200: Responds with an object with key article and value article object', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({body})=> {
      const {article_id, title, topic, author, body: articleBody, created_at, votes, article_img_url} = body.article
      expect(typeof article_id).toBe('number')
      expect(typeof title).toBe('string')
      expect(typeof topic).toBe('string')
      expect(typeof author).toBe('string')
      expect(typeof articleBody).toBe('string')
      expect(typeof created_at).toBe('string')
      expect(typeof votes).toBe('number')
      expect(typeof article_img_url).toBe('string')
    })
  });
  test('404: Responds with an error message when passed a non existing id', () => {
    return request(app)
    .get('/api/articles/99')
    .expect(404)
    .then(({body})=> {
      expect(body.msg).toBe(`No article found for article_id 99`)
    })
  });
  test('400: Responds with an error message when passed an invalid id', () => {
    return request(app)
    .get('/api/articles/notAnId')
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('Invalid input')
    })
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('200: Responds with an object with key comments and value array of comment objects, most recent first', () => {
    return request(app)
    .get('/api/articles/3/comments')
    .expect(200)
    .then(({body})=> {
      const {comments} = body
      expect(comments.length).not.toBe(0)
      expect(comments).toBeSortedBy('created_at', {descending: true})
      comments.forEach(({comment_id, votes, created_at, author, body, article_id})=> {
        expect(typeof comment_id).toBe('number')
        expect(typeof votes).toBe('number')
        expect(typeof created_at).toBe('string')
        expect(typeof author).toBe('string')
        expect(typeof body).toBe('string')
        expect(article_id).toBe(3)
      })
    })
  });
  test('200: Responds with an object with key comments and value empty array when an article has no comments', () => {
    return request(app)
    .get('/api/articles/4/comments')
    .expect(200)
    .then(({body})=> {
      const {comments} = body
      expect(comments).toEqual([])
    })
  });
  test('400: Responds with an error message when passed an invalid id', () => {
    return request(app)
    .get('/api/articles/notAnId/comments')
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('Invalid input')
    })
  });
  test('404: Responds with an error message when passed a non existing id', () => {
    return request(app)
    .get('/api/articles/999/comments')
    .expect(404)
    .then(({body})=> {
      expect(body.msg).toBe(`No article found for article_id 999`)
    })
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('201: Posts a new comment and responds with the newly posted comment', () => {
    return request(app)
    .post('/api/articles/4/comments')
    .send({
      username: "icellusedkars",
      body: "Very informative!"
    })
    .expect(201)
    .then(({body})=> {
      const {comment_id, article_id, body: commentBody, votes, author, created_at} = body.comment
      expect(typeof comment_id).toBe('number')
      expect(typeof article_id).toBe('number')
      expect(commentBody).toBe('Very informative!')
      expect(typeof votes).toBe('number')
      expect(author).toBe('icellusedkars')
      expect(typeof created_at).toBe('string')
    })
  });
  test('400: Responds with an error message when passed an invalid id', () => {
    return request(app)
    .post('/api/articles/notAnId/comments')
    .send({
      username: 'icellusedkars',
      body: 'potatoes'
    })
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('Invalid input')
    })
  });
  test('400: Responds with an error message when username is missing', () => {
    return request(app)
    .post('/api/articles/4/comments')
    .send({
      body: "something"
    })
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('username and body must exist')
    })
  })
  test('400: Responds with an error message when body is missing', () => {
    return request(app)
    .post('/api/articles/4/comments')
    .send({username: 'icellusedkars'})
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('username and body must exist')
    })
  });
  test('400: Responds with an error message upon foreign key violation/user does not exist', () => {
    return request(app)
    .post('/api/articles/4/comments')
    .send({
      username: 'hello123',
      body: 'hello everyone'
    })
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('user does not exist')
    })
  });
  test('404: Responds with an error message when passed a non existing id', () => {
    return request(app)
    .post('/api/articles/999/comments')
    .send({
      username: 'icellusedkars',
      body: 'great post'
    })
    .expect(404)
    .then(({body})=> {
      expect(body.msg).toBe('No article found for article_id 999')
    })
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('200: Updates the vote count on a specified article and responds with the updated article', () => {
    return request(app)
    .patch('/api/articles/2')
    .send({inc_votes: 50})
    .expect(200)
    .then(({body})=> {
      const {article_id, title, topic, author, body: articleBody, created_at, votes, article_img_url} = body.article
      expect(article_id).toBe(2)
      expect(typeof title).toBe('string')
      expect(typeof topic).toBe('string')
      expect(typeof author).toBe('string')
      expect(typeof articleBody).toBe('string')
      expect(typeof created_at).toBe('string')
      expect(votes).toBe(50)
      expect(typeof article_img_url).toBe('string')
    })
  });
  test('400: Responds with error when passed an invalid vote', () => {
    return request(app)
    .patch('/api/articles/1')
    .send({inc_votes: 'six'})
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('Invalid input')
    })
  });
  test('400: Responds with error when inc_votes key is missing', () => {
    return request(app)
    .patch('/api/articles/1')
    .send({})
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('inc_votes key must be present')
    })
  });
  test('400: Responds with error when passed an invalid article id', () => {
    return request(app)
    .patch('/api/articles/invalidId')
    .send({inc_votes: 5})
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('Invalid input')
    })
  });
  test('404: Responds with error when passed a non existent article id', () => {
    return request(app)
    .patch('/api/articles/999')
    .send({inc_votes: 5})
    .expect(404)
    .then(({body})=> {
      expect(body.msg).toBe('No article found for article_id 999')
    })
  })
});

describe('DELETE /api/comments/:comment_id', () => {
  test('204: Deletes the comment and responds with no content', () => {
    return request(app)
    .delete('/api/comments/1')
    .expect(204)
  });
  test('400: Responds with error when passed invalid comment id', () => {
    return request(app)
    .delete('/api/comments/invalidCommentId')
    .expect(400)
    .then(({body})=> {
      expect(body.msg).toBe('Invalid input')
    })
  });
  test('404: Responds with error when passed a non existent comment id', () => {
    return request(app)
    .delete('/api/comments/999')
    .expect(404)
    .then(({body})=> {
      expect(body.msg).toBe('no comment found for comment_id 999')
    })
  });
});

//22p02 neccessity question