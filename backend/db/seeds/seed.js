import connection from "../connection.js";
import users from "../data/development-data/users.js";
const { db, client } = connection;

const seed = async () => {
  try {
    const usersCollection = db.collection("users");
    await usersCollection.deleteMany({});
    await usersCollection.insertMany(users);
    console.log("Seeded successfully");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
};

seed();

export default seed;
