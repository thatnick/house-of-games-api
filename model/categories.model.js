const pool = require("../db/connection");

exports.selectCategories = async () => {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
};

exports.selectReviewById = async (review_id) => {
  const {
    rows: [review],
  } = await pool.query(
    `
    SELECT *
    FROM reviews
    WHERE review_id = $1
    `,
    [review_id]
  );
  return { review };
};
