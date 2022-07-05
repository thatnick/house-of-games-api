const {
  selectCategories,
  selectReviewById,
  updateReviewById,
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

exports.patchReviewById = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    if (!inc_votes)
      next({
        status: 400,
        msg: "Please provide inc_votes in the body of your request",
      });
    res.status(200).send(await updateReviewById(review_id, inc_votes));
  } catch (err) {
    next(err);
  }
};
