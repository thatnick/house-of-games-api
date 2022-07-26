const app = require("../app");
const request = require("supertest");
const pool = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(async () => await seed(testData));
afterAll(async () => pool.end());

describe("GET /api/categories", () => {
  test("status: 200, responds with an array of categories with slug and description props", async () => {
    const {
      body: { categories },
    } = await request(app).get("/api/categories").expect(200);
    expect(categories).toHaveLength(4);
    categories.forEach((category) => {
      expect(category).toEqual({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });
});
