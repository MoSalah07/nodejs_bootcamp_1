const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Courses = mongoose.model("Course", courseSchema);

module.exports = Courses;
