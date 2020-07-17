const express = require("express");
const branchController = require("../controller/branchController");
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
  .get(branchController.getAllBranches)
  .post(branchController.createBranch);

router
  .route("/:branch_id")
  .get(branchController.getBranch)
  .patch(branchController.updateBranch)
  .delete(branchController.deleteBranch);

module.exports = router;
