const {
  selectCommentsByReviewId,
  insertCommentByReviewId,
} = require("../models/comments.model");

exports.getCommentsByReviewId = async (req, res, next) => {
  try {
    res.send(await selectCommentsByReviewId(req.params.review_id));
  } catch (err) {
    next(err);
  }
};

exports.postCommentByReviewId = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { username, body } = req.body;
    if (!username || !body) {
      next({
        status: 400,
        msg: "Please provide username and body properties in the body of your request",
      });
    } else if (typeof body !== "string") {
      next({
        status: 400,
        msg: `${body} is not a valid comment body`,
      });
    } else if (typeof username !== "string") {
      next({
        status: 400,
        msg: `${username} is not a valid username`,
      });
    } else {
      res
        .status(201)
        .send(await insertCommentByReviewId(review_id, username, body));
    }
  } catch (err) {
    next(err);
  }
};
