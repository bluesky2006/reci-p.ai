const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");

const ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${ENV}`) });

const uri = process.env.ATLAS_URI;
if (!uri) {
  throw new Error("No MongoDB connection string configured in ATLAS_URI");
}

async function connectToDb() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGO_DB_NAME || "recipai");
  console.log(`Connected to database: ${db.databaseName}`);
  return { client, db };
}

module.exports = connectToDb;
