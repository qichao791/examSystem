const express = require("express");
const questionbankController = require("../controller/questionbankController");
const router = express.Router(); 

router
  .route("/")
  //.get(questionbankController.getAllBranches)
  .post(questionbankController.createQues);

router
  .route("/:ques_id")
  .get(questionbankController.getQuesByID)
  .patch(questionbankController.updateQues)
  .delete(questionbankController.deleteQues);

router
  .route("/:grade")
  .get(questionbankController.getQuesByID)
  .patch(questionbankController.updateQues)
  .delete(questionbankController.deleteQues);

module.exports = router;