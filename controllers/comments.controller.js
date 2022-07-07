const { selectCommentsByReviewId } = require("../models/comments.model");

exports.getCommentsByReviewId = async (req, res, next) => {
  try {
    res.send(await selectCommentsByReviewId(req.params.review_id));
  } catch (err) {
    next(err);
  }
};
