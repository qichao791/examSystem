const express = require("./node_modules/express");
const departController = require("../controller/departController");
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
  .get(departController.getAllDeparts)
  .post(departController.createDepart);

router
  .route("/:depart_id")
  .get(departController.getDepart)
  .patch(departController.updateDepart)
  .delete(departController.deleteDepart);
router
  .route("/getBranchByDepart")
  .post(departController.getBranchByDepart)
router
  .route("/addBranchToDepart")
  .post(departController.addBranchToDepart) 
router
  .route("/delBranchFromDepart")
  .post(departController.delBranchFromDepart)   
module.exports = router;