const express = require("express");
const userController = require("../controller/userController");
const professionalbankController = require("../controller/questionbankController");

const router = express.Router();
const tools = require("../utils/tools")

router
    .route("/user")
    .post(userController.addUser)
    .put(userController.updateUser)
    .get(userController.getUsersByDepartId)
    .delete(userController.deleteUser)

router
    .route("/question/questionbank")
    .post(professionalbankController.addPublicQues)
    .put(professionalbankController.updatePublicQues)
module.exports = router;
