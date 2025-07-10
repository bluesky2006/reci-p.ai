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

const adjustRecipe = async (db, recipeIdString, favourite) => {
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

// {
//   _id: '686cedd6237d6f414d7d1c16',
//   title: 'Avocado Toast',
//   ingredients: [
//     '1 ripe avocado',
//     '2 slices of wholegrain bread',
//     'A pinch of sea salt'
//   ],
//   steps: [
//     'Step 1: Toast the bread slices to your preferred crispness.',
//     'Step 2: Cut the avocado in half, remove the pit, and scoop the flesh into a bowl.',
//     'Step 3: Mash the avocado with a fork until smooth but slightly chunky.',
//     'Step 4: Spread the mashed avocado evenly over the toasted bread.',
//     'Step 5: Sprinkle a pinch of sea salt on top before serving.'
//   ],
//   username: 'butter_bridge',
//   userId: '686cedd6237d6f414d7d1c09'
// }
module.exports = {
  fetchRecipe,
  insertRecipe,
  removeRecipe,
  adjustRecipe,
  updateRecipeOrder,
};
