const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

router.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Content-Type", "application/json");
    next();
  });

router
    .route("/login")
    .post(userController.userLogin)
router
    .route("/changePWD")
    .post(userController.changePWD)
router
    .route("/")
    .get(userController.getAllUsers)

module.exports = router;
