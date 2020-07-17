const express = require("express");
const upController = require("../controller/userpaperController");
const router = express.Router();

router.route("/").post(upController.generateOneUserPaper);
//router.route("/:paper_id").get(upController.getPaperByPid);
router.route("/getPaperByUid").get(upController.getPaperByUid);
router.route("/getPaperByUidPid").get(upController.getPaperByUidPid);
router.route("/updateByUidPid").post(upController.updateOneByUidPid);
router.route("/calculateByUidPid").post(upController.calculateByUidPid);
router.route("/deleteByUidPid").get(upController.deleteOneByUidPid);
router.route("/submitPaper").post(upController.submitPaper);

module.exports = router;
