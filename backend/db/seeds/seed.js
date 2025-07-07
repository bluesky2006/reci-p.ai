const seed = async (db, data) => {
  try {
    const usersCollection = db.collection("users");
    await usersCollection.deleteMany({});
    await usersCollection.insertMany(data);
    console.log("Seeded successfully");
  } catch (err) {
    console.error("Seeding failed:", err);
    throw err;
  }
};

module.exports = seed;
