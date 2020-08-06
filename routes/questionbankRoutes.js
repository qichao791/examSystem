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
  //.get(questionbankController.getAllBranches)
  .post(questionbankController.createPublicQues);

router
  .route("/:ques_id")
  .get(questionbankController.getPublicQuesByID)
  .patch(questionbankController.updatePublicQues)
  .delete(questionbankController.deletePublicQues);

router
  .route("/:grade")
  .get(questionbankController.getPublicQuesByGrade)
  //.patch(questionbankController.updateQues)
  //.delete(questionbankController.deleteQues);

router.route("/stem").post(questionbankController.getStatementByKeyWords)

module.exports = router;