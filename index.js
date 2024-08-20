const express = require("express");

const cors = require("cors");

const path = require("node:path");

require("dotenv").config();

const connectMongo = require("./db/db.js");

const courseRoute = require("./routes/courses.route.js");
const usersRoute = require("./routes/users.route.js");
const authRoute = require("./routes/auth.route.js");

const { ERROR } = require("./libs/status.types.js");

const PORT = process.env.PORT || 4000;

const app = express();

// For See Image Static in file uploads

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());

app.use(express.json());

app.use("/api/courses", courseRoute);
app.use(`/api/users`, usersRoute);
app.use(`/api/auth`, authRoute);
// Handle any url not has any url
// Global middleware for not found router
app.all("*", (req, res) => {
  res
    .status(404)
    .json({ status: ERROR, message: "this resource is not available" });
});

// handle Error with middleware asyncWrapper in controller
// Global Error Handler
app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).json({
    status: error.statusText || ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.get(`/netlify/functions/api`, (req, res) => {
  return res.send("hello world");
});

connectMongo();

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
