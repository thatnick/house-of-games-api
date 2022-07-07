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
    if (!review.exists) return resourceError(review_id, "review");

    const { rows } = await pool.query(
      `
      SELECT * FROM comments
      WHERE review_id = $1
      `,
      [review_id]
    );
    return rows;
  } catch (err) {
    return dbError(err, `${review_id} is not a valid review id`);
  }
};
