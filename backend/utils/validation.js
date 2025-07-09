const { ObjectId } = require("mongodb");

const validateUserIdExists = async (db, userId) => {
  if (!ObjectId.isValid(userId)) {
    throw { status: 400, message: "Invalid userId format" };
  }

  const userObjectId = new ObjectId(userId);
  const user = await db.collection("users").findOne({ _id: userObjectId });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return true;
};

const validateAndConvertUserId = (userIdString) => {
  if (!ObjectId.isValid(userIdString)) {
    throw { status: 404, message: "User not found" };
  }
  return new ObjectId(userIdString);
};

module.exports = { validateUserIdExists, validateAndConvertUserId };
