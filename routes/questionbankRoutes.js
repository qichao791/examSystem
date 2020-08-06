const express = require("./node_modules/express");
const questionbankController = require("../controller/questionbankController");
const router = express.Router(); 
router.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});

router
  .route("/")
  .get(questionbankController.getAllPublicQues)
  .post(questionbankController.createPublicQues);

router
  .route("/:ques_id")
  .get(questionbankController.getPublicQuesByID)
  .patch(questionbankController.updatePublicQues)
  .delete(questionbankController.deletePublicQues);

router
  .route("/getPublicQuesByGrade")
  .post(questionbankController.getPublicQuesByGrade)

<<<<<<< HEAD
router.route("/stem").post(questionbankController.getStatementByKeyWords)

=======
router
  .route("/importQuessToPublicBank")
  .post(questionbankController.importQuessToPublicBank);

router
  .route("/getLikeQuestion")
  .post(questionbankController.getLikeQuestion)
>>>>>>> dcdd6bc7fc95b23783b2e314c9e6a1288d880afa
module.exports = router;