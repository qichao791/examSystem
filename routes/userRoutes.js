const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();


router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)
  .post(userController.updateUserRecords);

//   router.use('/api/mobile/v1/users', courseRouter);
module.exports = router;
