const { ObjectId } = require("mongodb");

const fetchRecipe = async (db, recipeIdString) => {
  const recipeObjectId = new ObjectId(recipeIdString);
  const recipe = await db
    .collection("recipes")
    .findOne({ _id: recipeObjectId });
  if (!recipe) throw { status: 404, message: "User not found" };
  return recipe;
};

const insertRecipe = async (db, title, ingredients, steps, userId) => {
  const newRecipe = await db
    .collection("recipes")
    .insertOne({ title, ingredients, steps, userId });
  return newRecipe.insertedId;
};

const removeRecipe = async (db, recipeIdString) => {
  const recipeObjectId = new ObjectId(recipeIdString);
  const result = await db
    .collection("recipes")
    .deleteOne({ _id: recipeObjectId });
  if (result.deletedCount === 0) {
    throw { status: 404, message: "recipe not found" };
  }

  return;
};

const adjustRecipe = async (db, recipeIdString, favourite) => {
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
