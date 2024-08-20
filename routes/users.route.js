const express = require("express");

const verfiyToken = require("../middlewares/verfiyToken.js");

const { handleValidationError } = require("../middlewares/validation_api.js");
const {
  getAllUsers,
  createUser,
  getSingleUser,
  deleteUser,
} = require("../controllers/users.controller.js");

const usersRoute = express.Router();

usersRoute
  .route("/")
  .get(verfiyToken, getAllUsers)
  .post(
    verfiyToken,
    [
      handleValidationError(
        "email",
        "email Is Required",
        4,
        35,
        "email must be at least 4 to 35 words max"
      ),
      handleValidationError(
        "password",
        "password",
        6,
        35,
        "password must be at least 6 to 35 max"
      ),
    ],
    createUser
  );

usersRoute.route("/:userId").get(getSingleUser).delete(deleteUser);

module.exports = usersRoute;
