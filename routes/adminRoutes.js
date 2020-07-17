const express = require("express");
const userController = require("../controller/userController");
const questionbankController = require("../controller/questionbankController");
const professionalbankController = require("../controller/professionalbankController");
const subpublicbankController = require("../controller/subpublicbankController")
const adminController = require("../controller/adminController");

const router = express.Router();
const tools = require("../utils/tools");
// const { multer } = require("../utils/tools");
router.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Content-Type", "application/json");
    next();
  });
  
router
    .route("/user")
    .post(userController.addUser)
    .put(userController.updateUser)
    .get(userController.getUsersByDepartId)
    .delete(userController.deleteUser)

router
    .route("/question")
    .put(adminController.modifyQuestion)

router
    .route("/question/:bank_type")
    .post(adminController.addQuestion)

/*暂存
router
    .route("/question/professionalbank")
    .post(professionalbankController.addPublicQues)
    .put(professionalbankController.modifyPublicQues)

router
    .route("/question/subpublicbank")
    .post(professionalbankController.addPublicQues)
    .put(professionalbankController.modifyPublicQues)
*/

router
    .route("/file")
    .post(tools.multer().single("file"), adminController.upLoadFile)
module.exports = router;
