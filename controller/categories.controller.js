const { selectCategories } = require("../model/categories.model");

exports.getCategories = async (req, res) => {
  res.send(await selectCategories());
};
