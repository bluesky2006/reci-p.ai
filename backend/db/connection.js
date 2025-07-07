import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import path from "path";

const ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${ENV}`) });

const uri = process.env.ATLAS_URI;

if (!uri) {
  throw new Error("No MongoDB connection string configured in ATLAS_URI");
}

const client = new MongoClient(uri);

await client.connect();

const db = client.db(process.env.MONGO_DB_NAME || "recipai");

console.log(`Connected to database: ${db.databaseName}`);

export default { client, db };
