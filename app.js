const express = require("express");
const { getCategories } = require("./controller/categories.controller");

const app = express();

app.get("/api/categories", getCategories);

module.exports = app;
