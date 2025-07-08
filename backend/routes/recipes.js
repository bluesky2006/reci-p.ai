const express = require("express");
const router = express.Router();
const {
  getRecipe,
  postRecipe,
} = require("../controllers/recipes.controller.js");

router.get("/:_id", getRecipe);
router.post("/", postRecipe);
module.exports = router;
