const express = require("express");
const upController = require("../controller/userpaperController");
const router = express.Router();


router
  .route("/")
  //.get(upController.getAllUserPapers)
  .post(upController.generateOneUserPaper);
router
  .route("/:user_id")
  .get(upController.getPaperByUid)
  //.patch(upController.updateUserpaper)
 // .delete(upController.deleteUserpaper)
router
  .route("/up")
  .get(upController.getPaperByUid)
module.exports = router;