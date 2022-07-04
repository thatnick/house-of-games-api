const { selectCategories } = require("../model/categories.model");

exports.getCategories = async (req, res) => {
  try {
    res.send(await selectCategories());
  } catch (err) {
    next(err);
  }
};
