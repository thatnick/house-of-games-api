const pool = require("../db/connection");
const { resourceError, dbError } = require("./errors/model-errors");

exports.selectCommentsByReviewId = async (review_id) => {
  try {
    const {
      rows: [review],
    } = await pool.query(
      `
      SELECT (
        CASE WHEN EXISTS 
        (SELECT 1 FROM reviews WHERE review_id = $1)
        THEN true ELSE false END
      ) as exists
      `,
      [review_id]
    );
    if (!review.exists) return resourceError("review", "review_id", review_id);

    const { rows: comments } = await pool.query(
      `
      SELECT * FROM comments
      WHERE review_id = $1
      `,
      [review_id]
    );
    return { comments };
  } catch (err) {
    return dbError(err, "review", "review_id", review_id);
  }
};

exports.insertCommentByReviewId = async (review_id, username, body) => {
  try {
    const { rows } = await pool.query(
      `
      INSERT INTO comments
      (review_id, author, body)
      VALUES
      ($1, $2, $3)
      RETURNING *
      `,
      [review_id, username, body]
    );

    const [comment] = rows;
    if (comment) return { comment };
  } catch (err) {
    if (err.detail.includes("users")) {
      return dbError(err, "user", "username", username);
    } else if (err.detail.includes("reviews")) {
      return dbError(err, "review", "review_id", review_id);
    } else {
      return dbError(err);
    }
  }
};

exports.deleteCommentById = async (comment_id) => {
  try {
    const { rows } = await pool.query(
      `
      DELETE FROM comments
      WHERE comment_id = $1
      RETURNING *
      `,
      [comment_id]
    );
    if (rows.length <= 0) {
      return resourceError("comment", "comment_id", comment_id);
    }
  } catch (err) {
    return dbError(err);
  }
};
