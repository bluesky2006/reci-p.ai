import users from "../data/development-data/users.js";

const seed = async (db) => {
  try {
    const usersCollection = db.collection("users");
    await usersCollection.deleteMany({});
    await usersCollection.insertMany(users);
    console.log("Seeded successfully");
  } catch (err) {
    console.error("Seeding failed:", err);
    throw err;
  }
};

export default seed;
