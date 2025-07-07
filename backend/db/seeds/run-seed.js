import connection from "../connection.js";
import seed from "./seed.js";
const users = require("../data/development-data/users.js");
const { client, db } = connection;

const runSeed = async () => {
  try {
    await client.connect();
    await seed(db, users);
    console.log("Seeded successfully");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
};

runSeed();
