const express = require("express");
const paperController = require("../controller/paperController");
const router = express.Router(); //{ mergeParams: true }

router
  .route("/")
  .get(paperController.getAllPapers)
  .post(paperController.createPaper);

router
  .route("/:paper_id")
  .get(paperController.getPaper)
  .patch(paperController.updatePaper)
  .delete(paperController.deletePaper);

module.exports = router;
