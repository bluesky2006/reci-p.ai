const express = require("express");
const router = express.Router();
const { getUser, postUser } = require("../controllers/users.controller.js");

router.get("/:username", getUser);
router.post("/", postUser);
module.exports = router;
