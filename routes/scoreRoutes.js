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
    .route("/user/oneExamAnalysisOfUser")
    .post(scoreAnalysisController.oneExamAnalysisOfUser)
router
    .route("/user/examsAnalysis")
    .post(scoreAnalysisController.examsAnalysisOfUser)
router
    .route("/exam/oneExamAnalysis")
    .get(scoreAnalysisController.examAnalysisByScoreSegment)
router
    .route("/exam/examThreeQuesAccuracy")
    .get(scoreAnalysisController.examThreeQuesAccuracy)
router
    .route("/exam/analysisOneMonth")
    .post(scoreAnalysisController.analysisOneMonth)


module.exports = router;
