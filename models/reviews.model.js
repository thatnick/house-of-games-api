const pool = require("../db/connection");
const format = require("pg-format");
const { resourceError, dbError } = require("./errors/model-errors");

exports.selectReviews = async (
  sort_by = "created_at",
  order = "desc",
  category
) => {
  try {
    let table = "";
    if (sort_by !== "vote_count" && sort_by !== "comment_count") {
      table = "reviews.";
    }
    let whereClause;
    if (category) {
      whereClause = format("WHERE reviews.category = %L", category);
    }

    const reviewsQuery = format(
      `
      SELECT
        reviews.*, 
        (SELECT COUNT(votes.review_id) FROM votes WHERE votes.review_id = reviews.review_id) AS vote_count, 
        (SELECT COUNT(comments.review_id) FROM comments WHERE comments.review_id = reviews.review_id) AS comment_count
      FROM reviews
      %s
      ORDER BY %s%I %s
      `,
      whereClause,
      table,
      sort_by,
      order
    );

    const { rows: reviews } = await pool.query(reviewsQuery);
    return { reviews };
  } catch (err) {
    return dbError(err, "review", sort_by);
  }
};

exports.selectReviewById = async (review_id) => {
  try {
    const {
      rows: [review],
    } = await pool.query(
      `
      SELECT
        reviews.*, 
        (SELECT COUNT(votes.review_id) FROM votes WHERE votes.review_id = reviews.review_id) AS vote_count, 
        (SELECT COUNT(comments.review_id) FROM comments WHERE comments.review_id = reviews.review_id) AS comment_count
      FROM reviews
      WHERE reviews.review_id = $1
      `,
      [review_id]
    );

    if (review) return { review };
    return resourceError("review", "review_id", review_id);
  } catch (err) {
    return dbError(err, "review", "review_id", review_id);
  }
};

exports.updateReviewById = async (username, review_id, inc_votes) => {
  try {
    if (inc_votes >= 1) {
      await pool.query(
        `
      INSERT INTO votes ( username, review_id ) VALUES ($1, $2)
      `,
        [username, review_id]
      );
    } else if (inc_votes <= -1) {
      await pool.query(
        `
        DELETE FROM votes WHERE username = $1 AND review_id = $2
      `,
        [username, review_id]
      );
    }
    const {
      rows: [review],
    } = await pool.query(
      `
      SELECT
         reviews.*, 
         (SELECT COUNT(votes.review_id) FROM votes WHERE votes.review_id = reviews.review_id) AS vote_count, 
         (SELECT COUNT(comments.review_id) FROM comments WHERE comments.review_id = reviews.review_id) AS comment_count
       FROM reviews
       WHERE reviews.review_id = $1;
      `,
      [review_id]
    );
    if (review) return { review };
    return resourceError("review", "review_id", review_id);
  } catch (err) {
    if (err.detail.includes("reviews")) {
      return dbError(err, "review", "review_id", review_id);
    }
  }
};

exports.selectVotesByReviewIdAndUsername = async (review_id, username) => {
  const {
    rows: [voted],
  } = await pool.query(
    `
    SELECT review_id
    FROM votes
    WHERE review_id = $1 AND username = $2
    `,
    [review_id, username]
  );
  console.log(voted);
  return voted ? true : false;
};
