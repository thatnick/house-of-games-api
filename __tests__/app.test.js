const app = require("../app");
const request = require("supertest");
const pool = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(async () => await seed(testData));
afterAll(async () => pool.end());

describe("ALL /*", () => {
  test("status: 404, responds with error message when the route does not exist", async () => {
    const { body } = await request(app).get("/api/category");
    expect(body.msg).toBe(
      "404 Not Found: the route /api/category does not exist"
    );
  });
});

describe("GET /api/categories", () => {
  test("status: 200, responds with an array", async () => {
    const { body } = await request(app).get("/api/categories").expect(200);
    expect(body).toEqual(expect.any(Array));
  });

  test("response array contains categories with slug and description", async () => {
    const { body } = await request(app).get("/api/categories");
    body.forEach((category) => {
      expect(category).toEqual({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("status: 200, responds with the review with the given id", async () => {
    const { body } = await request(app).get("/api/reviews/1").expect(200);

    expect(body.review).toEqual({
      review_id: 1,
      title: "Agricola",
      designer: "Uwe Rosenberg",
      owner: "mallionaire",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      review_body: "Farmyard fun!",
      category: "euro game",
      created_at: "2021-01-18T10:00:20.514Z",
      votes: 1,
    });
  });

  test("status: 404, responds with error if a review with the given id does not exist", async () => {
    const { body } = await request(app).get("/api/reviews/14").expect(404);

    expect(body).toEqual({
      review: {},
      msg: "There is no review with the id 14",
    });
  });

  test("status: 400, responds with error if a review_id is not a number", async () => {
    const { body } = await request(app)
      .get("/api/reviews/sometext")
      .expect(400);

    expect(body).toEqual({
      msg: "sometext is not a valid review id",
    });
  });
});
