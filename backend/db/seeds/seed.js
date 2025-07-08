const seed = async (db, data) => {
  try {
    const usersCollection = db.collection("users");
    const recipesCollection = db.collection("recipes");

    await usersCollection.deleteMany({});
    await recipesCollection.deleteMany({});

    const result = await usersCollection.insertMany(data.users);

    const userIdMap = {};
    data.users.forEach((user, i) => {
      userIdMap[user.username] = result.insertedIds[i];
    });

    const recipesWithUserIds = data.recipes.map((recipe) => ({
      ...recipe,
      userId: userIdMap[recipe.username],
    }));

    await recipesCollection.insertMany(recipesWithUserIds);
  } catch (err) {
    console.error("Seeding failed:", err);
    throw err;
  }
};

module.exports = seed;
