const fetchUser = async (db, username) => {
  const user = await db.collection("users").findOne({ username });
  if (!user) throw { status: 404, message: "User not found" };
  return user;
};

module.exports = fetchUser;
