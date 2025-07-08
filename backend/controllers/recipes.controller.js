const {
  insertRecipe,
  fetchRecipe,
  removeRecipe,
  adjustRecipe,
  updateRecipeOrder,
} = require("../models/recipes.model.js");

const getRecipe = (req, res, next) => {
  const { _id } = req.params;
  const db = req.app.locals.db;
  return fetchRecipe(db, _id)
    .then((recipe) => {
      res.status(200).send(recipe);
    })
    .catch((err) => {
      next(err);
    });
};

const postRecipe = (req, res, next) => {
  const { title, ingredients, steps, userId } = req.body;
  const db = req.app.locals.db;
  return insertRecipe(db, title, ingredients, steps, userId)
    .then((createdRecipe) => {
      res.status(201).send({ createdRecipe });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteRecipe = (req, res, next) => {
  const { _id } = req.params;
  const db = req.app.locals.db;
  return removeRecipe(db, _id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

const patchRecipe = (req, res, next) => {
  const { _id } = req.params;
  const { favourite } = req.body;
  const db = req.app.locals.db;

  return adjustRecipe(db, _id, favourite)
    .then((updatedRecipe) => {
      res.status(200).send({ updatedRecipe });
    })
    .catch((err) => {
      next(err);
    });
};

const patchRecipeOrder = (req, res, next) => {
  const { _userId } = req.params;
  const { orderedRecipeIds } = req.body;
  const db = req.app.locals.db;

  return updateRecipeOrder(db, _userId, orderedRecipeIds)
    .then(() => res.status(204).send())
    .catch(next);
};

module.exports = {
  patchRecipe,
  getRecipe,
  postRecipe,
  deleteRecipe,
  patchRecipeOrder,
};
