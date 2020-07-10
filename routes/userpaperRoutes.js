const express = require("express");
const upController = require("../controller/userpaperController");
const router = express.Router();


router
  .route("/")
  //.get(upController.getAllUserPapers)
  .post(upController.generateOneUserPaper);
//router
  //.route("/:id")
  //.get(upController.getOneUserpaper)
  //.patch(upController.updateUserpaper)
 // .delete(upController.deleteUserpaper)

module.exports = router;