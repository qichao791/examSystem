const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

router
    .route("/login")
    .post(userController.userLogin)

router
    .route("/")
    .get(userController.getAllUsers)

module.exports = router;
