import connection from "../connection.js";
import { userData } from "./path/to/index.js";
const { db, client } = connection;

const seed = async () => {
  try {
    const usersCollection = db.collection("users");
    await usersCollection.deleteMany({});
    await usersCollection.insertMany(userData);
    console.log("Seeded successfully");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await client.close();
  }
};

seed();
