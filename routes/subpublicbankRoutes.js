const express = require("express");
const subpublicbankController = require("../controller/subpublicbankController");
const router = express.Router(); 

router
  .route("/")
  //.get(questionbankController.getAllBranches)
  .post(subpublicbankController.createSubQues);

router
  .route("/:ques_id")
  .get(subpublicbankController.getSubQuesByID)
  .patch(subpublicbankController.updateSubQues)
  .delete(subpublicbankController.deleteSubQues);

router
  .route("/:grade")
  .get(subpublicbankController.getSubQuesByGrade)
  //.patch(questionbankController.updateQues)
  //.delete(questionbankController.deleteQues);

module.exports = router;