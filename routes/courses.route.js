const express = require("express");
const {
  getAllCourses,
  getSingleCourse,
  createCourse,
  deleteCourse,
  updateCourse,
} = require("../controllers/courses.controller");

const { handleValidationError } = require("../middlewares/validation_api.js");

const verfiyToken = require("../middlewares/verfiyToken.js");
const userRoles = require("../libs/role.js");
const allowedTo = require("../middlewares/allowedTo.js");

const coursesRoute = express.Router();

coursesRoute
  .route("/")
  .get(getAllCourses)
  .post(
    verfiyToken,
    allowedTo(userRoles.MANAGER),
    [
      handleValidationError(
        "title",
        "title is required",
        3,
        20,
        "title must be at least 3"
      ),
      handleValidationError(
        "price",
        "price is required",
        1,
        5,
        "price must be at least 1"
      ),
    ],
    createCourse
  );

coursesRoute
  .route(`/:courseId`)
  .get(getSingleCourse)
  .delete(
    verfiyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    deleteCourse
  )
  .patch(updateCourse);

module.exports = coursesRoute;
