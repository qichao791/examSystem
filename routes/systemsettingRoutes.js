const express = require("express");
const sysController = require("../controller/systemsettingCortroller");
const router = express.Router();

router.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Content-Type", "application/json");
    next();
});

router.route("/")
    .get(sysController.getParameters)
    .put(sysController.modifyParameters);
// router.route("/createParameters").post(sysController.createParameters);
// router.route("/addParameters").post(sysController.addParameters);
// router.route("/getPaperByUidPid").get(sysController.getPaperByUidPid);
// router.route("/deleteParameters").delete(sysController.deleteParameters);

module.exports = router;