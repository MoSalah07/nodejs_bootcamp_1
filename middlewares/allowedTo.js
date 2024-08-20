const appError = require("../libs/appError");
const { FAIL } = require("../libs/status.types");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(
        appError.createError("this role is not authorized", 401, FAIL)
      );
    }
    next();
  };
};
