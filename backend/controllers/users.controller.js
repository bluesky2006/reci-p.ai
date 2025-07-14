const {
  fetchUser,
  insertUser,
  fetchUserRecipes,
  fetchUserByUsername,
} = require("../models/users.model");

const getUser = (req, res, next) => {
  const { _id } = req.params;
  const db = req.app.locals.db;
  return fetchUser(db, _id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const getUserByUsername = (req, res, next) => {
  const { email } = req.params;
  const db = req.app.locals.db;
  return fetchUserByUsername(db, email)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const postUser = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "bad request" });
  }
  const { username, name } = req.body;
  const db = req.app.locals.db;
  return insertUser(db, username, name)
    .then((createdUser) => {
      res.status(201).send({ createdUser });
    })
    .catch((err) => {
      next(err);
    });
};

const getUserRecipes = (req, res, next) => {
  const { _userId } = req.params;
  const db = req.app.locals.db;
  return fetchUserRecipes(db, _userId)
    .then((recipes) => {
      const formattedRecipes = recipes.map((recipe) => ({
        ...recipe,
        _id: recipe._id.toString(),
        userId: recipe.userId.toString(),
      }));
      res.status(200).send({ recipes: formattedRecipes });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = { getUser, postUser, getUserRecipes, getUserByUsername };
