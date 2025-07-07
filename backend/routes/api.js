const express = require("express");
const router = express.Router();
const { getEndPoints } = require("../controllers/api.controller.js");
const usersRouter = require("./users");

router.get("/", getEndPoints);
router.use("/users", usersRouter);

module.exports = router;
