const app = require("../app");
const request = require("supertest");
const pool = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(async () => await seed(testData));
afterAll(async () => pool.end());

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

  test("status: 404, responds with error message when the route does not exist", async () => {
    const { body } = await request(app).get("/api/category");
    expect(body.msg).toBe(
      "404 Not Found: the route /api/category does not exist"
    );
  });
});
