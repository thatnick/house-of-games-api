const { selectCategories } = require("../models/categories.model");

exports.getCategories = async (req, res, next) => {
  try {
    res.send(await selectCategories());
  } catch (err) {
    next(err);
  }
};
