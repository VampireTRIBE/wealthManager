const mongoose = require("mongoose");

async function DB_connect() {
  try {
    mongoose.connect(process.env.DB_URL);
    console.log("Database Connection Successful...");
  } catch (err) {
    console.error("Database Connection Failed:", err);
  }
}

module.exports = DB_connect;
