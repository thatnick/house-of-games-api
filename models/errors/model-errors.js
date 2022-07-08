const resourceError = (resource, property, value) => {
  return Promise.reject({
    status: 404,
    msg: `There is no ${resource} with the ${property} ${value}`,
  });
};

const dbError = (err, resource, property, value) => {
  if (err.code === "22P02") {
    return Promise.reject({
      status: 400,
      msg: `${value} is not a valid ${property}`,
    });
  } else if (err.code === "23503") {
    return resourceError(resource, property, value);
  }
  return Promise.reject();
};

module.exports = { resourceError, dbError };
