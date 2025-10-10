const mongoose = require("mongoose");

async function DB_connect() {
  try {
    // ✅ MongoDB URI must be a string
    await mongoose.connect("mongodb://127.0.0.1:27017/wealthmanager", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connection Successful...");
  } catch (err) {
    console.error("Database Connection Failed:", err);
  }
}

const Category = require("../models/category");
const User = require("../models/user");

// Connect to database
DB_connect();

async function run() {
  try {
    // Register a new user
    const newUser = await User.register(
      { firstName: "John", lastName: "Doe", email: "john@example.com" },
      "password123"
    );
    console.log("User ID:", newUser._id);

    // Create categories
    const electronics = await Category.create({
      name: "Electronics",
      user: newUser._id,
    });

    const phones = await Category.create({
      name: "Phones",
      parentCategory: electronics._id,
      user: newUser._id,
    });

    console.log("Categories created:", electronics.name, phones.name);
  } catch (err) {
    console.error(err);
  } finally {
    // Close DB connection and exit
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();
