const express = require("./node_modules/express");
const userController = require("../controller/userController");
const questionbankController = require("../controller/questionbankController");
const professionalbankController = require("../controller/professionalbankController");
const subpublicbankController = require("../controller/subpublicbankController");
const adminController = require("../controller/adminController");
const paperController = require("../controller/paperController");

const router = express.Router();
const tools = require("../utils/tools");
router.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});

router.route("/login").post(adminController.adminLogin);
router
  .route("/user")
  .post(userController.addUser)
  .put(userController.updateUser)
  .get(userController.getUsersByDepartId)
  .delete(userController.deleteUser);

router
  .route("/question")
  .put(adminController.modifyQuestion)
  .delete(adminController.deleteQuestion);

router.route("/question/:bank_type").post(adminController.addQuestion);

router
  .route("/paper")
  .post(paperController.addPaper)
  .put(paperController.modifyPaper)
  .delete(paperController.removePaper);

router
  .route("/file")
  .post(tools.multer().single("file"), adminController.upLoadFile)
  .delete(adminController.deleteFile);

module.exports = router;
