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

describe.only('GET /api/users', () => {
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