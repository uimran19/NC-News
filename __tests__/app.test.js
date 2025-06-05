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