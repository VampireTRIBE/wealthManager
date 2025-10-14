const express = require("express");
const router = express.Router({ mergeParams: true });

const productsControllers = require("../controllers/productControllers");
const { isLogedIn, checkID, checkOwner, checkExists } = require("../utills/authentication/authentication");

// routes

router
  .route("/")
  .post(isLogedIn,
    checkID({type:"user", paramName:"u_id"}),
    checkID({type:"category", paramName:"c_id"}),
    checkExists({type:"category", Param:"c_id"}),
    checkOwner({type:"category", Param1: "c_id", Param2: "u_id"}),
    //data validation is need to be done
    productsControllers.addNewProduct)

router
  .route("/edit")
  .patch(productsControllers.deleteProduct);

module.exports = router;
