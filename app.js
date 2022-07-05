const express = require("express");
const {
  getCategories,
  getReviewById,
} = require("./controller/categories.controller");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

app.use("*", (req, res) => {
  res
    .status(404)
    .send({ msg: `404 Not Found: the route ${req.baseUrl} does not exist` });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "500 Internal Server Error" });
});

module.exports = app;
