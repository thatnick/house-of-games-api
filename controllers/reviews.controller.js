const {
  selectReviews,
  selectReviewById,
  updateReviewById,
} = require("../models/reviews.model");

exports.getReviews = async (req, res, next) => {
  try {
    const { sort_by, category } = req.query;
    let { order } = req.query;
    if (
      order &&
      order.toUpperCase() !== "ASC" &&
      order.toUpperCase() !== "DESC"
    ) {
      next({
        status: 400,
        msg: `${order} is not a valid sort order`,
      });
    } else {
      res.send(await selectReviews(sort_by, order, category));
    }
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
    if (!inc_votes) {
      next({
        status: 400,
        msg: "Please provide inc_votes in the body of your request",
      });
    } else {
      res.status(200).send(await updateReviewById(review_id, inc_votes));
    }
  } catch (err) {
    next(err);
  }
};
