const { ObjectId } = require("mongodb");

const fetchRecipe = async (db, recipeIdString) => {
  const recipeObjectId = new ObjectId(recipeIdString);
  const recipe = await db
    .collection("recipes")
    .findOne({ _id: recipeObjectId });
  if (!recipe) throw { status: 404, message: "User not found" };
  return recipe;
};

module.exports = fetchRecipe;
