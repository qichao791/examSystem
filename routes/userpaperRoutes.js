const express = require("express");
const upController = require("../controller/userpaperController");
const router = express.Router();

router.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});

router.route("/").post(upController.generateUPforUsers);
router.route("/updateGradeForQuesBank").post(upController.updateGradeForThreeQuesBanks);
router.route("/getPaperByPid").post(upController.getPaperByPid);
router.route("/getPaperByUid").get(upController.getPaperByUid);
router.route("/getPaperByUidPid").get(upController.getPaperByUidPid);
router.route("/getThreeScoresByUidPid").get(upController.getThreeScoresByUidPid);

router.route("/updateByUidPid").post(upController.updateOneByUidPid);
//router.route("/calculateByUidPid").post(upController.calculateByUidPid);
router.route("/deleteByUidPid").post(upController.deleteOneByUidPid);
router.route("/deleteByPid").delete(upController.deleteByPid);
router.route("/submitPaper").post(upController.submitPaper);
router.route("/getOneQuesRandomly").post(upController.getOneQuesRandomly);
router.route("/reAssignPaperToNewUsers").post(upController.reAssignPaperToNewUsers);
router.route("/getUPinfoByPid").post(upController.getUPinfoByPid);
router.route("/getUsersByPidAndGroupByDepartment").post(upController.getUsersByPidAndGroupByDepartment);

router.route("/getUserInfoByPid").post(upController.getUserInfoByPid);
router.route("/getUPEssentialsByPid").post(upController.getUPEssentialsByPid);
router.route("/modifyGrades").post(upController.modifyGrades);
router.route("/getExamPaperInfoByPid").post(upController.getExamPaperInfoByPid); 
router.route("/getAllExamPaperInfoDuringOnePeriod").post(getEPInfoByPidList); 
module.exports = router;
