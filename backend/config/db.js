const mongoose = require("mongoose");
const { seedDatabase } = require("./seed");

let databaseEnabled = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.log("MONGO_URI not set. Using in-memory demo data.");
    return false;
  }

  try {
    await mongoose.connect(uri);
    databaseEnabled = true;
    console.log("MongoDB connected");
    await seedDatabase();
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.log("Using in-memory demo data instead.");
    return false;
  }
};

const isDatabaseEnabled = () => databaseEnabled;

module.exports = connectDB;
module.exports.isDatabaseEnabled = isDatabaseEnabled;
