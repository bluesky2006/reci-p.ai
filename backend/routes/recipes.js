const express = require("express");
const router = express.Router();
const {
  getRecipe,
  postRecipe,
  deleteRecipe,
  patchRecipeFavourite,
  patchRecipeTitle,
} = require("../controllers/recipes.controller.js");

router.get("/:_id", getRecipe);
router.post("/", postRecipe);
router.delete("/:_id", deleteRecipe);
router.patch("/:_id", patchRecipeFavourite);
router.patch("/:_id/details", patchRecipeTitle);

module.exports = router;
