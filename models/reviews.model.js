const pool = require("../db/connection");
const { resourceError, dbError } = require("./errors/model-errors");

exports.selectReviews = async () => {
  const { rows } = await pool.query(
    `
    SELECT reviews.*, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC
    `
  );
  return rows;
};

exports.selectReviewById = async (review_id) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT reviews.*, COUNT(comments.review_id) AS comment_count
      FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id
      `,
      [review_id]
    );

    const [review] = rows;
    if (review) return { review };
    return resourceError(review_id, "review");
  } catch (err) {
    return dbError(err, `${review_id} is not a valid review id`);
  }
};

exports.updateReviewById = async (review_id, inc_votes) => {
  try {
    const { rows } = await pool.query(
      `
      UPDATE reviews
      SET votes = reviews.votes + $1
      FROM (
        SELECT COUNT(comments.review_id) AS comment_count
        FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $2
      ) review
      WHERE reviews.review_id = $2
      RETURNING *
      `,
      [inc_votes, review_id]
    );

    const [review] = rows;
    if (review) return { review };
    return resourceError(review_id, "review");
  } catch (err) {
    return dbError(err, `${inc_votes} is not a valid number of votes`);
  }
};
