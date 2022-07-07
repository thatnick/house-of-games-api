const { selectUsers } = require("../models/users.model");

exports.getUsers = async (req, res, next) => {
  try {
    res.send(await selectUsers());
  } catch (err) {
    next(err);
  }
};
