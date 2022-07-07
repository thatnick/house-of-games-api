exports.resourceError = (id, type) => {
  return Promise.reject({
    status: 404,
    msg: `There is no ${type} with the id ${id}`,
  });
};

exports.dbError = (err, msg) => {
  if (err.code === "22P02") {
    return Promise.reject({
      status: 400,
      msg,
    });
  }
  return Promise.reject();
};
