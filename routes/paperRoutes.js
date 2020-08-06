const express = require("./node_modules/express");
const paperController = require("../controller/paperController");
const router = express.Router(); //{ mergeParams: true }

router.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");
  next();
});

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
