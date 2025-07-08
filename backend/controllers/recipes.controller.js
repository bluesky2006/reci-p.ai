const { insertRecipe, fetchRecipe } = require("../models/recipes.model.js");

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
  const { username, name } = req.body;
  const db = req.app.locals.db;
  return insertRecipe(db, username, name)
    .then((createdRecipe) => {
      res.status(201).send({ createdRecipe });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getRecipe, postRecipe };
