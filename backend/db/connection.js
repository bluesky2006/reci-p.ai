const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${ENV}`) });

const uri = process.env.ATLAS_URI;
if (!uri) {
  throw new Error("No MongoDB connection string configured in ATLAS_URI");
}

async function connectToDb() {
  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME || "recipai",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to database: ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
}

module.exports = connectToDb;
