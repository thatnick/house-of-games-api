const express = require("express");
const cors = require("cors");

const { getCategories } = require("./controllers/categories.controller");
const {
  getReviews,
  getReviewById,
  postVotesByReviewId,
  getVotesByReviewIdAndUsername,
} = require("./controllers/reviews.controller");
const {
  getCommentsByReviewId,
  postCommentByReviewId,
  deleteCommentById,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);

app.get(
  "/api/reviews/:review_id/votes/:username",
  getVotesByReviewIdAndUsername
);
app.post("/api/reviews/:review_id/votes", postVotesByReviewId);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.use("*", (req, res) => {
  res
    .status(404)
    .send({ msg: `404 Not Found: the route ${req.baseUrl} does not exist` });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg && err.type && err[err.type]) {
    res.status(err.status).send({ [err.type]: err[err.type], msg: err.msg });
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "500 Internal Server Error" });
});

module.exports = app;
