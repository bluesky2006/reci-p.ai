const express = require("express");
const router = express.Router();
const getUser = require("../controllers/users.controller.js");

router.get("/:username", getUser);

module.exports = router;
