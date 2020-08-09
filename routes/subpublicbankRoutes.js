const express = require("express");
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

<<<<<<< HEAD


router
  .route("/getLikeQuestion")
  .post(subpublicbankController.getLikeQuestion)


router
  .route("/importQuessToSubPublicBank")
  .post(subpublicbankController.importQuessToSubPublicBank)

router
  .route("/:grade")
  .post(subpublicbankController.getSubQuesByGrade)

=======
router
  .route("/:grade")
  .post(subpublicbankController.getSubQuesByGrade)
>>>>>>> 465d6146550ecaa1b9956edd6821f124a45d2c67
module.exports = router;