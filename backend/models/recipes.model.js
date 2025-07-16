const { ObjectId } = require("mongodb");
const { validateUserIdExists } = require("../utils/validation");

const fetchRecipe = async (db, recipeIdString) => {
  if (!ObjectId.isValid(recipeIdString)) {
    throw { status: 404, message: "Recipe not found" };
  }
  const recipeObjectId = new ObjectId(recipeIdString);
  const recipe = await db
    .collection("recipes")
    .findOne({ _id: recipeObjectId });
  if (!recipe) throw { status: 404, message: "User not found" };
  return recipe;
};
const insertRecipe = async (
  db,
  title,
  ingredients,
  steps,
  userId,
  image,
  summary
) => {
  if (
    typeof title !== "string" ||
    title.trim() === "" ||
    !Array.isArray(ingredients) ||
    ingredients.length === 0 ||
    !Array.isArray(steps) ||
    steps.length === 0 ||
    !userId ||
    !ObjectId.isValid(userId)
  ) {
    throw { status: 400, message: "Bad Request" };
  }
  let validIngredients = true;
  ingredients.forEach((ing) => {
    if (typeof ing !== "string" || ing.trim() === "") {
      validIngredients = false;
    }
  });

  let validSteps = true;
  steps.forEach((step) => {
    if (typeof step !== "string" || step.trim() === "") {
      validSteps = false;
    }
  });

  if (!validIngredients || !validSteps) {
    throw { status: 400, message: "Bad Request" };
  }

  await validateUserIdExists(db, userId);

  const userObjectId = new ObjectId(userId);

  const newRecipe = await db.collection("recipes").insertOne({
    title: title.trim(),
    ingredients,
    steps,
    userId: userObjectId,
    image,
    summary,
  });

  return newRecipe.insertedId;
};

const removeRecipe = async (db, recipeIdString) => {
  if (!ObjectId.isValid(recipeIdString)) {
    throw { status: 404, message: "Recipe not found" };
  }
  const recipeObjectId = new ObjectId(recipeIdString);
  const result = await db
    .collection("recipes")
    .deleteOne({ _id: recipeObjectId });
  if (result.deletedCount === 0) {
    throw { status: 404, message: "Recipe not found" };
  }

  return;
};

const adjustRecipeFavourite = async (db, recipeIdString, favourite) => {
  if (!ObjectId.isValid(recipeIdString)) {
    throw { status: 404, message: "Recipe not found" };
  }
  if (typeof favourite !== "boolean") {
    throw { status: 400, message: "Bad Request" };
  }

  const recipeObjectId = new ObjectId(recipeIdString);

  const result = await db
    .collection("recipes")
    .updateOne({ _id: recipeObjectId }, { $set: { favourite } });

  return result;
};

const adjustRecipeTitle = async (db, recipeIdString, title) => {
  if (!ObjectId.isValid(recipeIdString)) {
    throw { status: 404, message: "Recipe not found" };
  }

  const recipeObjectId = new ObjectId(recipeIdString);

  const result = await db
    .collection("recipes")
    .updateOne({ _id: recipeObjectId }, { $set: { title } });

  return result;
};

const updateRecipeOrder = async (db, userIdString, orderedIds) => {
  const userObjectId = new ObjectId(userIdString);

  const bulkOps = orderedIds.map((recipeId, index) => ({
    updateOne: {
      filter: {
        _id: new ObjectId(recipeId),
        userId: userObjectId,
      },
      update: { $set: { order: index } },
    },
  }));

  return db.collection("recipes").bulkWrite(bulkOps);
};

module.exports = {
  fetchRecipe,
  insertRecipe,
  removeRecipe,
  adjustRecipeFavourite,
  updateRecipeOrder,
  adjustRecipeTitle,
};
