const {
  selectCategories,
  selectReviewById,
} = require("../model/categories.model");

exports.getCategories = async (req, res, next) => {
  try {
    res.send(await selectCategories());
  } catch (err) {
    next(err);
  }
};

exports.getReviewById = async (req, res, next) => {
  try {
    res.send(await selectReviewById(req.params.review_id));
  } catch (err) {
    next(err);
  }
};
