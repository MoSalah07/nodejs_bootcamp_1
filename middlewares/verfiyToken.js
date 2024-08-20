const jwt = require("jsonwebtoken");
const { ERROR } = require("../libs/status.types");
const appError = require("../libs/appError");

const verfiyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    const error = appError.createError("token is required", 401, ERROR);
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET);
    // add new features to request in api extension after this middleware verifytoken
    req.currentUser = currentUser;
    // console.log(currentUser);
    next();
  } catch (err) {
    const error = appError.createError("Invalid token", 401, ERROR);
    return next(error);
  }
};

module.exports = verfiyToken;
