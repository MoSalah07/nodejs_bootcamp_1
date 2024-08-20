const asyncWrapper = require("../middlewares/asyncWrapper");
const Users = require("../models/Users.model");
const { SUCCESS, FAIL, ERROR } = require("../libs/status.types");
const { validationResult } = require("express-validator");
const appError = require("../libs/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  // From Multer Image
  // console.log(req.file.filename);

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = appError.createError(errors.array()[0].msg, 400, FAIL);
  //   return next(error);
  // }

  if (!email) {
    return next(appError.createError("Email is required", 400, FAIL));
  } else if (email.trim().length < 6) {
    return next(
      appError.createError("Email at least included 6 chars", 400, FAIL)
    );
  }

  if (!password) {
    return next(appError.createError("Password is required", 400, FAIL));
  } else if (password.trim().legnth < 6) {
    return next(
      appError.createError("Password at least included 6 chars", 400, FAIL)
    );
  }

  const oldUser = await Users.findOne({ email });
  if (oldUser) {
    const error = appError.createError("User Already Registered", 400, FAIL);
    return next(error);
  }
  // Hashed PAssword
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new Users({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file && req.file.filename,
  });
  // Generate JWT token
  const token = jwt.sign(
    {
      email: newUser.email,
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  newUser.token = token;
  await newUser.save();
  return res.status(201).json({ status: SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.createError(errors.array()[0].msg, 400, FAIL);
    return next(error);
  }

  const user = await Users.findOne({ email });

  if (!user) {
    const error = appError.createError("user not found", 400, FAIL);
    return next(error);
  }
  const matchedPAssword = await bcrypt.compare(password, user.password);

  if (user && matchedPAssword) {
    // Generate JWT token

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      status: SUCCESS,
      data: { token, message: "Logged in successfully" },
    });
  } else {
    const error = appError.createError("Something went wrong", 500, ERROR);
    return next(error);
  }
});

module.exports = {
  register,
  login,
};
