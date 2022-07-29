const app = require("../app");
const request = require("supertest");
const pool = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(async () => await seed(testData));
afterAll(async () => pool.end());

describe("GET /api/reviews", () => {
  test("status: 200, responds with an array of reviews, sorted by date descending", async () => {
    const {
      body: { reviews },
    } = await request(app).get("/api/reviews").expect(200);

    expect(reviews).toHaveLength(13);
    expect(reviews).toBeSortedBy("created_at", {
      descending: true,
      compare: (a, b) => new Date(a) - new Date(b),
    });
    reviews.forEach((review) => {
      expect(review).toEqual({
        review_id: expect.any(Number),
        owner: expect.any(String),
        title: expect.any(String),
        category: expect.any(String),
        review_img_url: expect.any(String),
        created_at: expect.any(String),
        vote_count: expect.any(String),
        review_body: expect.any(String),
        designer: expect.any(String),
        comment_count: expect.any(String),
      });
    });
  });

  describe("queries", () => {
    test("status: 200, responds with an array of reviews sorted by votes descending", async () => {
      const {
        body: { reviews },
      } = await request(app)
        .get("/api/reviews")
        .query({ sort_by: "vote_count" })
        .expect(200);

      expect(reviews).toHaveLength(13);
      expect(reviews).toBeSortedBy("vote_count", {
        descending: true,
        compare: (a, b) => new Date(a) - new Date(b),
      });
    });

    test("status: 200, responds with an array of reviews sorted by date ascending", async () => {
      const {
        body: { reviews },
      } = await request(app)
        .get("/api/reviews")
        .query({ order: "asc" })
        .expect(200);

      expect(reviews).toHaveLength(13);
      expect(reviews).toBeSortedBy("created_at", {
        descending: false,
        compare: (a, b) => new Date(a) - new Date(b),
      });
    });

    test("status: 200, responds with an array of reviews filtered by category 'dexterity', sorted by date descending", async () => {
      const {
        body: { reviews },
      } = await request(app)
        .get("/api/reviews")
        .query({ category: "social deduction" })
        .expect(200);

      expect(reviews).toHaveLength(11);
      expect(reviews).toBeSortedBy("created_at", {
        descending: true,
        compare: (a, b) => new Date(a) - new Date(b),
      });
      reviews.forEach((review) => {
        expect(review).toEqual(
          expect.objectContaining({
            category: "social deduction",
          })
        );
      });
    });

    test("status: 200, accepts multiple queries, responds with an appropriate array of reviews ", async () => {
      const {
        body: { reviews },
      } = await request(app)
        .get("/api/reviews")
        .query({
          sort_by: "vote_count",
          order: "asc",
          category: "social deduction",
        })
        .expect(200);

      expect(reviews).toHaveLength(11);
      expect(reviews).toBeSortedBy("vote_count", {
        descending: false,
        compare: (a, b) => new Date(a) - new Date(b),
      });
    });
  });

  test("status: 400, responds with an error if sort_by column does not exist", async () => {
    const { body } = await request(app)
      .get("/api/reviews")
      .query({ sort_by: "bananas" })
      .expect(400);

    expect(body).toEqual({
      msg: "There is no property bananas on review",
    });
  });

  test("status: 400, responds with an error if order is not asc or desc", async () => {
    const { body } = await request(app)
      .get("/api/reviews")
      .query({ order: "sideways" })
      .expect(400);

    expect(body).toEqual({
      msg: "sideways is not a valid sort order",
    });
  });

  test("status: 200, responds with an empty array if filter category does not exist", async () => {
    const {
      body: { reviews },
    } = await request(app)
      .get("/api/reviews")
      .query({ category: "boring" })
      .expect(200);

    expect(reviews).toHaveLength(0);
  });

  test("status: 200, responds with an empty array if the category exists but has no associated reviews", async () => {
    const {
      body: { reviews },
    } = await request(app)
      .get("/api/reviews")
      .query({ category: "children's games" })
      .expect(200);

    expect(reviews).toHaveLength(0);
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("status: 200, responds with the review with the given id", async () => {
    const {
      body: { review },
    } = await request(app).get("/api/reviews/1").expect(200);

    expect(review).toEqual({
      review_id: 1,
      title: "Agricola",
      designer: "Uwe Rosenberg",
      owner: "mallionaire",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      review_body: "Farmyard fun!",
      category: "euro game",
      created_at: "2021-01-18T10:00:20.514Z",
      vote_count: "1",
      comment_count: "0",
    });
  });

  test("status: 404, responds with error if a review with the given id does not exist", async () => {
    const { body } = await request(app).get("/api/reviews/14").expect(404);

    expect(body).toEqual({
      msg: "There is no review with the review_id 14",
    });
  });

  test("status: 400, responds with error if a review_id is not a number", async () => {
    const { body } = await request(app)
      .get("/api/reviews/sometext")
      .expect(400);

    expect(body).toEqual({
      msg: "sometext is not a valid review_id",
    });
  });
});

describe("POST /api/reviews/:review_id", () => {
  test("status: 202, in/decrements votes column for the given review_id by +1 or -1, responds with updated review", async () => {
    const { body } = await request(app)
      .post("/api/reviews/2/votes")
      .send({ username: "mallionaire", inc_votes: -1 })
      .expect(200);

    expect(body.review).toEqual({
      review_id: 2,
      title: "Jenga",
      designer: "Leslie Scott",
      owner: "philippaclaire9",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      review_body: "Fiddly fun for all the family",
      category: "dexterity",
      created_at: "2021-01-18T10:01:41.251Z",
      vote_count: "3",
      comment_count: "3",
    });
  });

  test("status: 404, responds with error if a review with the given id does not exist", async () => {
    const { body } = await request(app)
      .post("/api/reviews/14/votes")
      .send({ username: "mallionaire", inc_votes: 1 })
      .expect(404);

    expect(body).toEqual({
      msg: "There is no review with the review_id 14",
    });
  });

  test("status: 400, responds with error if no body sent", async () => {
    const { body } = await request(app)
      .post("/api/reviews/1/votes")
      .expect(400);

    expect(body).toEqual({
      msg: "Please provide inc_votes in the body of your request",
    });
  });

  test("status: 400, responds with error if inc_votes is not a number", async () => {
    const { body } = await request(app)
      .post("/api/reviews/2/votes")
      .send({ username: "mallionaire", inc_votes: "some text" })
      .expect(400);

    expect(body).toEqual({
      msg: "some text is not a valid number of votes",
    });
  });
});
