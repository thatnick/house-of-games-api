const pool = require("../db/connection");

exports.selectUsers = async () => {
  const { rows } = await pool.query("SELECT * FROM users");
  return rows;
};
