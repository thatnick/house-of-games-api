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

exports.postVotesByReviewId = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { username, inc_votes } = req.body;
    if (!inc_votes) {
      next({
        status: 400,
        msg: "Please provide inc_votes in the body of your request",
      });
    } else if (typeof inc_votes !== "number") {
      next({
        status: 400,
        msg: `${inc_votes} is not a valid number of votes`,
      });
    } else {
      res
        .status(200)
        .send(await updateReviewById(username, review_id, inc_votes));
    }
  } catch (err) {
    next(err);
  }
};
