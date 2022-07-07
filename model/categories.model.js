const pool = require("../db/connection");

exports.selectCategories = async () => {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
};

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

exports.selectUsers = async () => {
  const { rows } = await pool.query("SELECT * FROM users");
  return rows;
};

const resourceError = (id, type) => {
  return Promise.reject({
    status: 404,
    msg: `There is no ${type} with the id ${id}`,
  });
};

const dbError = (err, msg) => {
  if (err.code === "22P02") {
    return Promise.reject({
      status: 400,
      msg,
    });
  }
  return Promise.reject();
};
