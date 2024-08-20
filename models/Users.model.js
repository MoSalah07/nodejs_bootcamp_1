const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../libs/role");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "filed must be a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    role: {
      type: String,
      enum: [userRoles.ADMIN, userRoles.MANAGER, userRoles.USER],
      default: userRoles.USER,
    },
    avatar: {
      type: String,
      default: "uploads/profile.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("User", userSchema);

module.exports = Users;
