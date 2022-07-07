const express = require("express");
const {
  getCategories,
  getReviews,
  getReviewById,
  patchReviewById,
  getCommentsByReviewId,
  getUsers,
} = require("./controller/categories.controller");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

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
