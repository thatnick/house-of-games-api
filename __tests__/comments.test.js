const app = require("../app");
const request = require("supertest");
const pool = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(async () => await seed(testData));
afterAll(async () => pool.end());

describe("GET /api/reviews/:review_id/comments", () => {
  test("status: 200, responds with an array of comments for the given review_id", async () => {
    const { body: comments } = await request(app)
      .get("/api/reviews/2/comments")
      .expect(200);

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
    const { body: comments } = await request(app)
      .get("/api/reviews/1/comments")
      .expect(200);

    expect(comments).toHaveLength(0);
  });

  test("status: 404, responds with error if a review with the given id does not exist", async () => {
    const { body: error } = await request(app)
      .get("/api/reviews/99/comments")
      .expect(404);

    expect(error).toEqual({
      msg: "There is no review with the id 99",
    });
  });

  test("status: 400, responds with error if a review_id is not a number", async () => {
    const { body: error } = await request(app)
      .get("/api/reviews/sometext/comments")
      .expect(400);

    expect(error).toEqual({
      msg: "sometext is not a valid review id",
    });
  });
});
