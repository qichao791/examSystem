const express = require("express");
const groupController = require("../controller/groupController");
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
  .get(groupController.getAllGroup)
  .post(groupController.createGroup);
router
  .route("/group_id")
  .get(groupController.getGroup)
  .delete(groupController.deleteGroup);
router
  .route("/getUsersByGroup")
  .post(groupController.getUsersByGroup);
router
  .route("/addUserToGroup")
  .post(groupController.addUserToGroup); 
router
  .route("/delUserFromGroup")
  .post(groupController.delUserFromGroup);

module.exports = router;
