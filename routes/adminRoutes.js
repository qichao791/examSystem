const express = require("express");
const userController = require("../controller/userController");
const questionbankController = require("../controller/questionbankController");
const professionalbankController = require("../controller/professionalbankController");
const subpublicbankController = require("../controller/subpublicbankController")
const adminController = require("../controller/adminController");

const router = express.Router();
const tools = require("../utils/tools");
// const { multer } = require("../utils/tools");

router
    .route("/user")
    .post(userController.addUser)
    .put(userController.updateUser)
    .get(userController.getUsersByDepartId)
    .delete(userController.deleteUser)

router
    .route("/question")
    .put(adminController.modifyQuestion)
    .delete(adminController.deleteQuestion)

router
    .route("/question/:bank_type")
    .post(adminController.addQuestion)

router
    .route("/file")
    .post(tools.multer().single("file"), adminController.upLoadFile)
    .delete(adminController.deleteFile)

module.exports = router;
