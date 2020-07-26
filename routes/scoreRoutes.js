const express = require("express");
const scoreAnalysisController = require("../controller/scoreAnalysisController");


const router = express.Router();
const tools = require("../utils/tools");
const { get } = require("mongoose");
router.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Content-Type", "application/json");
    next();
});


router
    .route("/branch/averageScore")  //某branch若干次考试平均分比较

router
    .route("/branch/oneExamAnalysis")
    .get(scoreAnalysisController.oneExamAnalysis)

module.exports = router;
