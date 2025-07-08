const express = require("express");
const router = express.Router();
const { getEndPoints } = require("../controllers/api.controller.js");
const usersRouter = require("./users");
const recipesRouter = require("./recipes");

router.get("/", getEndPoints);
router.use("/users", usersRouter);
router.use("/recipes", recipesRouter);

module.exports = router;
