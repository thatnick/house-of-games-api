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
