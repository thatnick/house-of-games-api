const pool = require("../db/connection");

exports.selectCategories = async () => {
  const { rows: categories } = await pool.query("SELECT * FROM categories");
  return { categories };
};
