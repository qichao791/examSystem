const express = require("express");
const departController = require("../controller/departController");
const router = express.Router(); //{ mergeParams: true }

router
  .route("/")
  .get(departController.getAllDeparts)
  .post(departController.createDepart);

router
  .route("/:depart_id")
  .get(departController.getDepart)
  .patch(departController.updateDepart)
  .delete(departController.deleteDepart);

module.exports = router;