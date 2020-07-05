const express = require("express");
const branchController = require("../controller/branchController");
const router = express.Router(); //{ mergeParams: true }

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
