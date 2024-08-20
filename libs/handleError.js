const { ERROR, FAIL } = require("./status.types");

const handleErrorControllerCourses = (res, err) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `The ${field} '${err.keyValue[field]}' is already taken. Please choose another ${field}.`;
    return res.status(401).json({ status: FAIL, message });
  }

  console.log(err);
  return res
    .status(500)
    .json({ status: ERROR, message: "Unable to communicate with database" });
};

module.exports = {
  handleErrorControllerCourses,
};
