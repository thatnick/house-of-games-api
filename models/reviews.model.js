const pool = require("../db/connection");
const format = require("pg-format");
const { resourceError, dbError } = require("./errors/model-errors");

exports.selectReviews = async (
  sort_by = "created_at",
  order = "desc",
  category
) => {
  const table = "reviews";
  let whereClause;
  if (category) {
    whereClause = format("WHERE reviews.category = %L", category);
  }

  const reviewsQuery = format(
    `
    SELECT reviews.*, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    %s
    GROUP BY reviews.review_id
    ORDER BY %I.%I %s
    `,
    whereClause,
    table,
    sort_by,
    order
  );

  const { rows } = await pool.query(reviewsQuery);
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
    return resourceError("review", "review_id", review_id);
  } catch (err) {
    return dbError(err, "review", "review_id", review_id);
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
    return resourceError("review", "review_id", review_id);
  } catch (err) {
    return dbError(err, "review", "number of votes", inc_votes);
  }
};
