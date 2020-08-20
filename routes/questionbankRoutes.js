const express = require("express");
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
  .route("/getKnowlege")
  .post(questionbankController.getKnowlege)

router
  .route("/getPublicQuesByKnowlege")
  .post(questionbankController.getPublicQuesByKnowlege)
  
router
  .route("/getPublicQuesByGrade")
  .post(questionbankController.getPublicQuesByGrade)

router.route("/stem").post(questionbankController.getStatementByKeyWords)

router
  .route("/importQuessToPublicBank")
  .post(questionbankController.importQuessToPublicBank);

router
  .route("/getLikeQuestion")
  .post(questionbankController.getLikeQuestion)
  
router
  .route("/:ques_id")
  .get(questionbankController.getPublicQuesByID)
  .patch(questionbankController.updatePublicQues)
  .delete(questionbankController.deletePublicQues);
module.exports = router;