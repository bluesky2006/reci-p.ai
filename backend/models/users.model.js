const { validateAndConvertUserId } = require("../utils/validation");

const fetchUser = async (db, userIdString) => {
  const userObjectId = validateAndConvertUserId(userIdString);
  const user = await db.collection("users").findOne({ _id: userObjectId });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }
  return user;
};

const fetchUserByUsername = async (db, email) => {
  const user = await db.collection("users").findOne({ username: email });
  if (!user) {
    throw { status: 404, message: "User not found" };
  }
  return user;
};

const insertUser = async (db, username, name) => {
  const usernameCheck = await db.collection("users").findOne({ username });
  if (usernameCheck) {
    throw { status: 400, message: "username is taken" };
  }

  if (!username) {
    throw { status: 400, message: "bad request" };
  }
  const newUser = await db.collection("users").insertOne({ username, name });
  return newUser.insertedId;
};

const fetchUserRecipes = async (db, userIdString) => {
  const userObjectId = validateAndConvertUserId(userIdString);
  const recipes = await db
    .collection("recipes")
    .find({ userId: userObjectId })
    .toArray();
  return recipes;
};

module.exports = {
  fetchUser,
  insertUser,
  fetchUserRecipes,
  fetchUserByUsername,
};
