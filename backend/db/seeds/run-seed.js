import connection from "../connection.js";
import devData from "../data/development-data/index.js";
import seed from "./seed.js";
const { client, db } = connection;

const runSeed = async () => {
  try {
    await seed(devData, db);
    console.log("Seeded successfully");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
};

runSeed();
