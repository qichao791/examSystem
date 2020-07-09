const express = require("express");
const professionalbankController = require("../controller/professionalbankController");
const router = express.Router(); 

router
  .route("/")
  //.get(questionbankController.getAllBranches)
  .post(professionalbankController.createProfQues);

router
  .route("/:ques_id")
  .get(professionalbankController.getProfQuesByID)
  .patch(professionalbankController.updateProfQues)
  .delete(professionalbankController.deleteProfQues);

router
  .route("/:grade")
  .get(professionalbankController.getProfQuesByGrade)
  //.patch(questionbankController.updateQues)
  //.delete(questionbankController.deleteQues);

module.exports = router;