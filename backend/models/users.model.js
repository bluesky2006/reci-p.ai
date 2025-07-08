const { ObjectId } = require("mongodb");

const fetchUser = async (db, userIdString) => {
  const userObjectId = new ObjectId(userIdString);
  const user = await db.collection("users").findOne({ _id: userObjectId });
  if (!user) throw { status: 404, message: "User not found" };
  return user;
};

const insertUser = async (db, username, name) => {
  const newUser = await db.collection("users").insertOne({ username, name });
  return newUser.insertedId;
};

const fetchUserRecipes = async (db, userIdString) => {
  const userObjectId = new ObjectId(userIdString);
  const recipes = await db
    .collection("recipes")
    .find({ userId: userObjectId })
    .toArray();
  return recipes;
};

module.exports = { fetchUser, insertUser, fetchUserRecipes };
