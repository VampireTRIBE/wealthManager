const express = require("express");
const router = express.Router({ mergeParams: true });

const categoryController = require("../controllers/categoryControllers");
const validate = require("../utills/validation/validation");
const { isLogedIn } = require("../utills/authentication/authentication");
isLogedIn;

// routes

router.route("/").post(isLogedIn, categoryController.addCategory);
router.route("/:s_id").patch(isLogedIn, categoryController.editCategory);
router.route("/:s_id").delete(isLogedIn, categoryController.delCategory);


module.exports = router;
