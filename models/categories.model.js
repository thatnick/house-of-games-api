const pool = require("../db/connection");

exports.selectCategories = async () => {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
};
