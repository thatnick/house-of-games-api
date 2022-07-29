const app = require("../app");
const request = require("supertest");
const pool = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(async () => await seed(testData));
afterAll(async () => pool.end());

describe("GET /api/reviews/:review_id/comments", () => {
  test("status: 200, responds with an array of comments for the given review_id", async () => {
    const {
      body: { comments },
    } = await request(app).get("/api/reviews/2/comments").expect(200);

    expect(comments).toHaveLength(3);
    comments.forEach((comment) => {
      expect(comment).toEqual({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        review_id: expect.any(Number),
      });
    });
  });

  test("status: 200, responds with an empty array if the given review_id has no comments", async () => {
    const {
      body: { comments },
    } = await request(app).get("/api/reviews/1/comments").expect(200);

    expect(comments).toHaveLength(0);
  });

  test("status: 404, responds with error if a review with the given id does not exist", async () => {
    const { body: error } = await request(app)
      .get("/api/reviews/99/comments")
      .expect(404);

    expect(error).toEqual({
      msg: "There is no review with the review_id 99",
    });
  });

  test("status: 400, responds with error if a review_id is not a number", async () => {
    const { body: error } = await request(app)
      .get("/api/reviews/sometext/comments")
      .expect(400);

    expect(error).toEqual({
      msg: "sometext is not a valid review_id",
    });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("status: 201, adds the comment to the db and responds with the added comment", async () => {
    const {
      body: { comment },
    } = await request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "mallionaire", body: "I am a comment" })
      .expect(201);

    expect(comment).toEqual({
      comment_id: 7,
      votes: 0,
      created_at: expect.any(String),
      author: "mallionaire",
      body: "I am a comment",
      review_id: 2,
    });
  });

  test("status: 404, responds with error if a review with the given id does not exist", async () => {
    const { body } = await request(app)
      .post("/api/reviews/14/comments")
      .send({ username: "mallionaire", body: "I am a comment" })
      .expect(404);

    expect(body).toEqual({
      msg: "There is no review with the review_id 14",
    });
  });

  test("status: 400, responds with error if no body sent", async () => {
    const { body } = await request(app)
      .post("/api/reviews/1/comments")
      .expect(400);

    expect(body).toEqual({
      msg: "Please provide username and body properties in the body of your request",
    });
  });

  test("status: 400, responds with error if body is not a string", async () => {
    const { body } = await request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "mallionaire", body: 99 })
      .expect(400);

    expect(body).toEqual({
      msg: "99 is not a valid comment body",
    });
  });

  test("status: 400, responds with error if username is not a string", async () => {
    const { body } = await request(app)
      .post("/api/reviews/2/comments")
      .send({ username: 88, body: "I am a comment" })
      .expect(400);

    expect(body).toEqual({
      msg: "88 is not a valid username",
    });
  });

  test("status: 400, responds with error if username does not exist", async () => {
    const { body } = await request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "idontexist", body: "I am a comment" })
      .expect(404);

    expect(body).toEqual({
      msg: "There is no user with the username idontexist",
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status: 204, deletes the comment with the given id", async () => {
    const { body } = await request(app).delete("/api/comments/1").expect(204);
    expect(body).toEqual({});
  });

  test("status: 404, responds with an error if no comment with the given id exists", async () => {
    const { body } = await request(app).delete("/api/comments/99").expect(404);

    expect(body).toEqual({
      msg: "There is no comment with the comment_id 99",
    });
  });

  test("status: 400, responds with error if comment_id is not a number", async () => {
    const { body } = await request(app)
      .delete("/api/comments/iamastring")
      .expect(400);

    expect(body).toEqual({
      msg: "iamastring is not a valid comment_id",
    });
  });
});
