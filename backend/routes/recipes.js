const express = require("express");
const router = express.Router();
const {
  getRecipe,
  postRecipe,
  deleteRecipe,
  patchRecipeFavourite,
  patchRecipe,
} = require("../controllers/recipes.controller.js");

router.get("/:_id", getRecipe);
router.post("/", postRecipe);
router.delete("/:_id", deleteRecipe);
router.patch("/:_id", patchRecipeFavourite);
router.patch("/:_id/details", patchRecipe);

module.exports = router;
