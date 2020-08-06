const express = require("./node_modules/express");
const professionalbankController = require("../controller/professionalbankController");
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