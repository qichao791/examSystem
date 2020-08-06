const express = require("./node_modules/express");
const subpublicbankController = require("../controller/subpublicbankController");
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
  .get(subpublicbankController.getSubPublicQuesByDepart)
  .post(subpublicbankController.createSubQues);
router
  .route("/getSubPublicQuesByDepart")
  .post(subpublicbankController.getSubPublicQuesByDepart)

router
  .route("/getLikeQuestion")
  .post(subpublicbankController.getLikeQuestion)

router
  .route("/:ques_id")
  .get(subpublicbankController.getSubQuesByID)
  .patch(subpublicbankController.updateSubQues)
  .delete(subpublicbankController.deleteSubQues);

router
  .route("/:grade")
  .post(subpublicbankController.getSubQuesByGrade)
module.exports = router;