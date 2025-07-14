const express = require("express");
const router = express.Router();
const {
  getUser,
  postUser,
  getUserRecipes,
  getUserByEmail,
} = require("../controllers/users.controller.js");
const { patchRecipeOrder } = require("../controllers/recipes.controller.js");

router.get("/:_id", getUser);
router.get("/:email/email", getUserByEmail);
router.get("/:_userId/recipes", getUserRecipes);
router.post("/", postUser);
router.patch("/:_userId/recipes/order", patchRecipeOrder);

module.exports = router;
