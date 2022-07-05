const format = require("pg-format");
const pool = require("../db/connection");

exports.selectCategories = async () => {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
};

exports.selectReviewById = async (review_id) => {
  try {
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
    return review
      ? { review }
      : Promise.reject({
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
    const {
      rows: [review],
    } = await pool.query(
      `UPDATE reviews
      SET votes = votes + $1
      WHERE review_id = $2
      RETURNING *
      `,

      [inc_votes, review_id]
    );
    return review
      ? { review }
      : Promise.reject({
          status: 400,
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
