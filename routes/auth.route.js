const express = require("express");

const { handleValidationError } = require("../middlewares/validation_api.js");
const { login, register } = require("../controllers/auth.controller.js");
const multer = require("multer");
const appError = require("../libs/appError.js");
const { ERROR } = require("../libs/status.types.js");
const Users = require("../models/Users.model.js");
const diskStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    // console.log(file);
    const { email } = req.body;
    const existingUser = await Users.findOne({ email });
    if (!existingUser) {
      cb(null, "uploads");
    } else {
      cb(
        appError.createError("Email is Existing Can't Add Image", 400, ERROR),
        false
      );
    }
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(appError.createError("file must be an image", 400, ERROR), false);
  }
};

const upload = multer({ storage: diskStorage, fileFilter });

const authRoute = express.Router();

authRoute.post(`/login`, login);
// hena ana 3mlt delete for express validator middleware 3lshan form-data send image in postman get error
authRoute.post(
  `/register`,
  // [
  //   handleValidationError(
  //     "email",
  //     "Email is required",
  //     3,
  //     25,
  //     "Email Must at least 3 words"
  //   ),
  //   handleValidationError(
  //     "password",
  //     "password is required",
  //     6,
  //     20,
  //     "Email Must at least 6 words"
  //   ),
  // ],
  upload.single("avatar"),
  register
);

module.exports = authRoute;
