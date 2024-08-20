const mongoose = require("mongoose");

const url = process.env.URL_DB || null;

async function connectMongo() {
  try {
    await mongoose.connect(url);
    console.log("server started");
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectMongo;
