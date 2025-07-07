const fetchUser = async (db, username) => {
  const user = await db.collection("users").findOne({ username });
  if (!user) throw { status: 404, message: "User not found" };
  return user;
};

const insertUser = async (db, username, name) => {
  const newUser = await db.collection("users").insertOne({ username, name });
  return newUser.insertedId;
};
module.exports = { fetchUser, insertUser };
