const {
  insertRecipe,
  fetchRecipe,
  removeRecipe,
  adjustRecipeFavourite,
  updateRecipeOrder,
  adjustRecipe,
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
  const { title, ingredients, steps, userId, image, summary } = req.body;
  const db = req.app.locals.db;
  return insertRecipe(db, title, ingredients, steps, userId, image, summary)
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

const patchRecipeFavourite = (req, res, next) => {
  const { _id } = req.params;
  const { favourite } = req.body;
  const db = req.app.locals.db;

  return adjustRecipeFavourite(db, _id, favourite)
    .then((updatedRecipe) => {
      res.status(200).send({ updatedRecipe });
    })
    .catch((err) => {
      next(err);
    });
};

const patchRecipe = (req, res, next) => {
  const { _id } = req.params;
  const { title, steps, ingredients } = req.body;
  const db = req.app.locals.db;

  return adjustRecipe(db, _id, title, steps, ingredients)
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
    .then((response) => res.status(200).send(response))
    .catch(next);
};

module.exports = {
  patchRecipeFavourite,
  getRecipe,
  postRecipe,
  deleteRecipe,
  patchRecipeOrder,
  patchRecipe,
};
