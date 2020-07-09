const express = require("express");
const questionbankController = require("../controller/questionbankController");
const router = express.Router(); 

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

module.exports = router;