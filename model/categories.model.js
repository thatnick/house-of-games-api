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
      SELECT *
      FROM reviews
      WHERE review_id = $1
      `,
      [review_id]
    );

    const [review] = rows;
    if (review) return { review };
    return Promise.reject({
      status: 404,
      msg: `There is no review with the id ${review_id}`,
      type: "review",
      review: {},
    });
  } catch (err) {
    if (err.code === "22P02") {
      return Promise.reject({
        status: 400,
        msg: `${review_id} is not a valid review id`,
      });
    }
    return Promise.reject();
  }
};

exports.updateReviewById = async (review_id, inc_votes) => {
  try {
    const { rows } = await pool.query(
      `UPDATE reviews
      SET votes = votes + $1
      WHERE review_id = $2
      RETURNING *
      `,
      [inc_votes, review_id]
    );

    const [review] = rows;
    if (review) return { review };
    return Promise.reject({
      status: 404,
      msg: `There is no review with the id ${review_id} to update`,
    });
  } catch (err) {
    if (err.code === "22P02") {
      return Promise.reject({
        status: 400,
        msg: `${inc_votes} is not a valid number of votes`,
      });
    }
    return Promise.reject();
  }
};
