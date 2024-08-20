const { SUCCESS, FAIL } = require("../libs/status.types");
const Courses = require("../models/Courses.model");
const { validationResult } = require("express-validator");
const asyncWrapper = require("../middlewares/asyncWrapper.js");
const AppError = require("../libs/appError.js");
const appError = require("../libs/appError.js");

const getAllCourses = asyncWrapper(async (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit;
  const allCourses = await Courses.find({}, { __v: false })
    .limit(limit)
    .skip(skip);
  return res.status(200).json({
    status: SUCCESS,
    data: {
      courses: allCourses,
    },
  });
});

const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await Courses.findById(courseId);
  if (!course) {
    const error = AppError.createError("course not found", 404, FAIL);
    return next(error);
  }
  return res.status(200).json({ status: SUCCESS, data: { course: course } });
});

const createCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  const { title, price } = req.body;
  if (!errors.isEmpty()) {
    const error = appError.createError(errors.array()[0].msg, 400, FAIL);
    return next(error);
  }
  const newCourse = await Courses.create({ title, price });
  return res
    .status(201)
    .json({ status: SUCCESS, data: { newCourse: newCourse } });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  await Courses.deleteOne({ _id: courseId });
  return res.status(200).json({
    status: SUCCESS,
    data: null,
    message: "course deleted successfully",
  });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const { title, price } = req.body;
  const course = await Courses.findById(courseId);
  if (!course) {
    const error = appError.createError("Course Not Found", 404, FAIL);
    return next(error);
  }

  const updateCourse = await Courses.updateOne(
    { _id: courseId },
    { $set: { title, price } }
  );

  return res.status(200).json({
    status: SUCCESS,
    data: { message: "course is updated successfully", course: updateCourse },
  });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  deleteCourse,
  updateCourse,
};
