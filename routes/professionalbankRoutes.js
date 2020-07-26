const express = require("express");
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
  .get(professionalbankController.getProfQuesByDepartAndBranch)
  .post(professionalbankController.createProfQues);
// router
//   .route("/getProfQuesByDepartAndBranch")
//   .get(questionbankController.getProfQuesByDepartAndBranch)
router
  .route("/getProfQuesByGrade")
  .post(professionalbankController.getProfQuesByGrade)
router
  .route("/:ques_id")
  .get(professionalbankController.getProfQuesByID)
  .patch(professionalbankController.updateProfQues)
  .delete(professionalbankController.deleteProfQues);

module.exports = router;