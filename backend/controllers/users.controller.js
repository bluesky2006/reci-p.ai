const fetchUser = require("../models/users.model");

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

module.exports = getUser;
