const connectToDb = require("../connection.js");
const seed = require("./seed.js");
const developmentData = require("../data/development-data");

const runSeed = async () => {
  try {
    const { client, db } = await connectToDb();

    await seed(db, developmentData);

    console.log("Seeded successfully");
    await client.close();
  } catch (err) {
    console.error("Seeding failed:", err);
  }
};

runSeed();
