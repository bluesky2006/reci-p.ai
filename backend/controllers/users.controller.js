const { fetchUser, insertUser } = require("../models/users.model");

const getUser = (req, res, next) => {
  const { username } = req.params;
  const db = req.app.locals.db;
  return fetchUser(db, username)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const postUser = (req, res, next) => {
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

module.exports = { getUser, postUser };
