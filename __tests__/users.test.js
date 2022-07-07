const app = require("../app");
const request = require("supertest");
const pool = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(async () => await seed(testData));
afterAll(async () => pool.end());

describe("GET /api/users", () => {
  test("status: 200, responds with an array of users", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    expect(body).toHaveLength(4);
    body.forEach((user) => {
      expect(user).toEqual({
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String),
      });
    });
  });
});
