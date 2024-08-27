const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const app = require("../app");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET/api/tpics", () => {
    test("200: responds with an array of topic objects", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.topics)).toBe(true);
                body.topics.forEach((topic) => {
                    expect(topic).toHaveProperty("slug", expect.any(String));
                    expect(topic).toHaveProperty("description", expect.any(String));
                });
            });
    });
    test("404: responds with 404 for non-existent routes", () => {
        return request(app)
          .get('/api/nonexistent')
          .expect(404)
          .then(({ body }) => {
            expect(body).toHaveProperty('message', 'Endpoint not found');
          });
      });
});
describe("GET /api", () => {
    test("200: responds with API documentation", () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty('GET /api');
          expect(body).toHaveProperty('GET /api/topics');
          expect(body).toHaveProperty('GET /api/articles');

          expect(body['GET /api']).toEqual({
            description: "serves up a json representation of all the available endpoints of the api"
          });

          expect(body['GET /api/topics']).toEqual({
            description: "serves an array of all topics",
            queries: [],
            exampleResponse: {
              topics: [{ "slug": "football", "description": "Footie!" }]
            }
          });

          expect(body['GET /api/articles']).toEqual({
            description: "serves an array of all articles",
            queries: ["author", "topic", "sort_by", "order"],
            exampleResponse: {
              articles: [
                {
                  title: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: "2018-05-30T15:59:13.341Z",
                  votes: 0,
                  comment_count: 6
                }
              ]
            }
          });
        });
    });

    test("404: responds with 404 for non-existent routes", () => {
      return request(app)
        .get('/api/nonexistent')
        .expect(404)
        .then(({ body }) => {
          expect(body).toHaveProperty('message', 'Endpoint not found');
        });
    });
  });
