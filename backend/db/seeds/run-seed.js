const connectToDb = require("../connection.js");
const seed = require("./seed.js");
const users = require("../data/development-data/users.js");

const runSeed = async () => {
  try {
    const { client, db } = await connectToDb();
    await seed(db, users);
    console.log("Seeded successfully");
    await client.close();
  } catch (err) {
    console.error("Seeding failed:", err);
  }
};

runSeed();
