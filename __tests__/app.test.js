const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const endpoints = require('../endpoints.json');
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
                Object.keys(endpoints).forEach(endpoint => {
                    expect(body).toHaveProperty(endpoint);
                    expect(body[endpoint]).toEqual(endpoints[endpoint]);
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

  describe('GET /api/articles/:article_id', () => {
    test('200: responds with an article object with the correct properties', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body: { article } }) => {
                expect(article).toEqual({
                    article_id: 1,
                    title: expect.any(String),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String)
                });
            });
    });
    test('404: responds with an error when article_id does not exist', () => {
        return request(app)
            .get('/api/articles/9999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
            });
    });

    test('400: responds with an error when article_id is not a valid number', () => {
        return request(app)
            .get('/api/articles/not-a-number')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid article ID');
            });
    });
});
describe('GET /api/articles', () => {
    test('200: responds with an array of articles sorted by date in descending order and without body property', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(Array.isArray(articles)).toBe(true);
          expect(articles.length).toBeGreaterThan(0);

          for (let i = 0; i < articles.length - 1; i++) {
            const currentDate = new Date(articles[i].created_at).getTime();
            const nextDate = new Date(articles[i + 1].created_at).getTime();
            expect(currentDate).toBeGreaterThanOrEqual(nextDate);
          }

          articles.forEach(article => {
            expect(article).not.toHaveProperty('body');
            expect(article).toHaveProperty('article_id');
            expect(article).toHaveProperty('title');
            expect(article).toHaveProperty('topic');
            expect(article).toHaveProperty('author');
            expect(article).toHaveProperty('created_at');
            expect(article).toHaveProperty('votes');
            expect(article).toHaveProperty('article_img_url');
            expect(article).toHaveProperty('comment_count');
          });
        });
    });

    test('404: responds with an error when querying with an invalid query', () => {
      return request(app)
        .get('/api/articles?invalid_query=some_value')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid query');
        });
    });
  });
  describe('GET /api/articles/:article_id/comments', () => {
    test('200: responds with an array of comments for the given article_id, sorted by date in descending order', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(Array.isArray(comments)).toBe(true);
                expect(comments.length).toBeGreaterThan(0);
                comments.forEach(comment => {
                    expect(comment).toHaveProperty('comment_id', expect.any(Number));
                    expect(comment).toHaveProperty('votes', expect.any(Number));
                    expect(comment).toHaveProperty('created_at', expect.any(String));
                    expect(comment).toHaveProperty('author', expect.any(String));
                    expect(comment).toHaveProperty('body', expect.any(String));
                    expect(comment).toHaveProperty('article_id', 1);
                });
                for (let i = 0; i < comments.length - 1; i++) {
                    const currentDate = new Date(comments[i].created_at).getTime();
                    const nextDate = new Date(comments[i + 1].created_at).getTime();
                    expect(currentDate).toBeGreaterThanOrEqual(nextDate);
                }
            });
    });

    test('400: responds with an error when article_id is not a valid ID', () => {
        return request(app)
            .get('/api/articles/not-a-number/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid article ID');
            });
    });

    test('200: responds with an empty array when article_id exists but there are no comments', () => {
        return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(Array.isArray(comments)).toBe(true);
                expect(comments.length).toBe(0);
            });
    });
});
describe('POST /api/articles/:article_id/comments', () => {
    test('201: responds with the newly posted comment', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'Great article!'
        };
        return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(201)
            .then(({ body: { comment } }) => {
                expect(comment).toHaveProperty('comment_id', expect.any(Number));
                expect(comment).toHaveProperty('votes', 0);
                expect(comment).toHaveProperty('created_at', expect.any(String));
                expect(comment).toHaveProperty('author', 'butter_bridge');
                expect(comment).toHaveProperty('body', 'Great article!');
                expect(comment).toHaveProperty('article_id', 1);
            });
    });

    test('400: responds with an error when missing required fields', () => {
        const newComment = {
            body: 'Great article!'
        };
        return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Missing required fields');
            });
    });

    test('404: responds with an error when article_id does not exist', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'Great article!'
        };
        return request(app)
            .post('/api/articles/999/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
            });
    });


    test('404: responds with an error when username does not exist', () => {
        const newComment = {
            username: 'non_existent_user',
            body: 'Great article!'
        };
        return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Username not found');
            });
    });

    test('400: responds with an error when body is empty', () => {
        const newComment = {
            username: 'butter_bridge',
            body: ''
        };
        return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Comment body cannot be empty');
            });
    });
});

describe('PATCH /api/articles/:article_id', () => {
    test('200: responds with the updated article when incrementing votes', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 5 })
            .expect(200)
            .then(({ body }) => {
                expect(body.article.votes).toBe(105);
            });
    });
    test('200: responds with the updated article when decrementing votes', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: -3 })
            .expect(200)
            .then(({ body }) => {
                expect(body.article.votes).toBe(97);
            });
    });

    test('400: responds with an error when missing inc_votes field', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Missing or invalid inc_votes field');
            });
    });

});
describe('DELETE /api/comments/:comment_id', () => {
    test('204: responds with no content when comment is successfully deleted', () => {
        return request(app)
            .delete('/api/comments/1')
            .expect(204);
    });

    test('404: responds with an error when comment_id does not exist', () => {
        return request(app)
            .delete('/api/comments/9999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Comment not found');
            });
    });

    test('400: responds with an error for invalid comment_id format', () => {
        return request(app)
            .delete('/api/comments/invalid_id')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid comment ID');
            });
    });
});