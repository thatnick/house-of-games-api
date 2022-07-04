const express = require("express");
const { getCategories } = require("./controller/categories.controller");

const app = express();

app.get("/api/categories", getCategories);

app.use("*", (req, res) => {
  res
    .status(404)
    .send({ msg: `404 Not Found: the route ${req.baseUrl} does not exist` });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "500 Internal Server Error" });
});

module.exports = app;
