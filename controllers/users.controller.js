const appError = require("../libs/appError");
const { FAIL, SUCCESS } = require("../libs/status.types.js");
const asyncWrapper = require("../middlewares/asyncWrapper");
const Users = require("../models/Users.model.js");
const { validationResult } = require("express-validator");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await Users.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  if (!users) {
    const error = appError.createError("Users Not Found", 404, FAIL);
    return next(error);
  }
  return res.status(200).json({ status: SUCCESS, data: { users } });
});

const getSingleUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.userId;
  const currentUser = await Users.findOne(
    { _id: userId },
    { __v: false, password: false }
  );
  if (!currentUser) {
    const error = appError.createError("Users Not Found", 404, FAIL);
    return next(error);
  }
  return res.status(200).json({ status: SUCCESS, data: { user: currentUser } });
});

const createUser = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.createError(errors.array()[0].msg, 400, FAIL);
    return next(error);
  }
  const newUser = await Users.create({ ...req.body });
  return res.status(201).json({ status: SUCCESS, data: { user: newUser } });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.userId;
  const userDeleted = await Users.deleteOne({ _id: userId });
  return res.status(200).json({
    status: SUCCESS,
    data: { message: "User Deleted Successfully", user: userDeleted },
  });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  deleteUser,
};
