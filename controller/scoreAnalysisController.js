const Userpaper = require("../model/userpaperModel");
const User = require("../model/userModel");
const Paper = require("../model/paperModel");
const Depart = require("../model/departModel")
const Branch = require("../model/branchModel")

/**
 * 班组长以上管理人员每月考试成绩汇总表
 */
exports.analysisOneMonth = async(req,res)=>{
 // console.log(req)
  var exam_month=req.body.paper_batch.length==5?req.body.paper_batch.substr(0,1):req.body.paper_batch.substr(0,2);
  try {
    var examList = await Paper.find({//根据名称和年份获取试卷
      paper_name: req.body.paper_name,
      paper_term: req.body.paper_term
    });
    var examListThisMonth = []; //某年份、某种名称、某个月份的所有考试
    var examCount;
   // console.log("examList:",examList)
    for (examCount = 0; examCount < examList.length; examCount++) {//从上面试卷中筛选出某月的试卷
      var batch_month =
        examList[examCount].paper_batch.length == 5
          ? examList[examCount].paper_batch.substr(0, 1)
          : examList[examCount].paper_batch.substr(0, 2);
      if (batch_month == exam_month) {
        examListThisMonth.push(examList[examCount]);
      }
    }
    //console.log("examListThisMonth:", examListThisMonth);
    var usersId = await Userpaper.find({ paper_id: req.body.paper_id }, "user_id");//获取到该类考试中的所有考生ID
    console.log("usersId:",usersId)
    scoreList=[];
    var user_score=[];
    for(var i=0;i<usersId.length;i++){
        var user=await User.findById(usersId[i].user_id);
        console.log("user:",user)
        var depart= await Depart.findById(user.depart_id)
        var branch=await Branch.findById(user.branch_id)
        var user_name=user.user_name
        var depart_name=depart.depart_name
        var branch_name=branch.branch_name
        var score=[]
        for(var j=0;j<examListThisMonth.length;j++){
          var user_paper=await Userpaper.findOne({paper_id:examListThisMonth[j]._id,user_id:user._id})
          if(user_paper==null) {score[j]=null}else{
            score[j]=user_paper.public_score+user_paper.subpublic_score+user_paper.professional_score
          }
        }
        var user_month_score={user_name,depart_name,branch_name,score}      
        user_score.push(user_month_score)
    }
    console.log("user_score:",user_score)
    
    res.status(200).json({
      examListThisMonth: examListThisMonth,
      user_score: user_score
    });


  } catch (err) {
    res.status(500).json({
      err
    });
    console.log("获取信息失败,", err);
  }

}

/**
 * 一个人某段时间的考试成绩分析
 */
exports.examsAnalysisOfUser = async (req, res) => {
  try {
    var begin_time = req.body.begin_time; //查询起止时间
    var end_time = req.body.end_time; //查询起止时间
    var user_id = req.body.user_id;
    //    console.log(begin_time)
    //    console.log("endTime:"+end_time)
    //    console.log(user_id)
    var userExamsInfo = await Userpaper.aggregate([
      {
        $lookup: {
          from: "paper",
          localField: "paper_id",
          foreignField: "_id",
          as: "userpaper_paper"
        }
      },
      {
        $match: { user_id: user_id }
      },
      // {
      //     $match: { $and: [{ 'userpaper_paper.start_time': { $gte: begin_time } }, { 'userpaper_paper.end_time': { $lte: end_time } }] }
      // },
      {
        $match: { "userpaper_paper.start_time": { $gte: begin_time } }
      },
      {
        $match: { "userpaper_paper.end_time": { $lte: end_time } }
      },

      {
        $project: {
          _id: 1,
          paper_id: 1,
          "userpaper_paper.paper_name": 1,
          user_id: 1,
          score: {
            $sum: ["$public_score", "$subpublic_score", "$professional_score"]
          },
          "userpaper_paper.start_time": 1
          //'userpaper_paper.end_time':1
        }
      },
      {
        $sort: {
          "userpaper_paper.start_time": 1
        }
      }
    ]);

    var papers_id = [];
    for (var i = 0; i < userExamsInfo.length; i++) {
      papers_id.push(userExamsInfo[i].paper_id);
    }
    //console.log("papers_id",papers_id)
    var papersAvgScore = await getAverageScoreByPapersid(papers_id);
    console.log("paperAverScore", papersAvgScore);
    var exams = [];
    exams[0] = [];
    exams[1] = [];
    var examsAvgScore = [];
    var userScores = [];
    var numsOfExams = papers_id.length;
    for (var i = 0; i < numsOfExams; i++) {
      // var exam={
      //     paper_id:papersAvgScore.paper_id,
      //     paper_name:papersAvgScore[i].paper_name[0]
      // }
      exams[0].push(papersAvgScore[i].paper_id);
      var paperFullName=papersAvgScore[i].paper_name[0]+papersAvgScore[i].paper_term[0]+'年'+papersAvgScore[i].paper_batch[0];
      exams[1].push(paperFullName);
      examsAvgScore.push(papersAvgScore[i].average_score);
      userScores.push(userExamsInfo[i].score);
    }
    console.log("userExamsInfo", userExamsInfo);
    console.log("userExamsInfo数目", userExamsInfo.length);

    res.status(200).json({
      exams: exams,
      examsAvgScore: examsAvgScore,
      userScores: userScores
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
    console.log(err);
  }
};

/***
 * 一个人某次考试成绩分析
 */
exports.oneExamAnalysisOfUser = async (req, res) => {
  try {
    var paper_id = [];
    paper_id.push(req.body.paper_id);
    var user_id = req.body.user_id;
    var paper_score = await getAverageScoreByPapersid(paper_id);
    var user_score = await Userpaper.findOne(
      { paper_id: paper_id, user_id: user_id },
      "public_score subpublic_score professional_score"
    );
    //user_score.totalScore =user_score.public_score+user_score.subpublic_score+user_score.professional_score

    res.status(200).json({
      user_score: user_score,
      paper_score: paper_score
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

/***
 * 分析某次考试各个分数段的人数
 */
exports.examAnalysisByScoreSegment = async (req, res) => {
  var paper_id = req.query.paper_id;
  var report = await getExamReportByPaperId(paper_id);
  var numPeople = report.length;
  var examScoreSegInfo = []; //成绩分段信息
  for (var i = 0; i < 10; i++) {
    //初始化10个分数段0~9,10~19，....99~100
    examScoreSegInfo[i] = [];
  }
  for (var i = 0; i < numPeople; i++) {
    var user = {
      name: report[i].userpaper_user[0].user_name,
      score: report[i].total_score
    };
    var scoreLevel = parseInt(report[i].total_score / 10);
    switch (scoreLevel) {
      case 0:
        examScoreSegInfo[0].push(user);
        break;
      case 1:
        examScoreSegInfo[1].push(user);
        break;
      case 2:
        examScoreSegInfo[2].push(user);
        break;
      case 3:
        examScoreSegInfo[3].push(user);
        break;
      case 4:
        examScoreSegInfo[4].push(user);
        break;
      case 5:
        examScoreSegInfo[5].push(user);
        break;
      case 6:
        examScoreSegInfo[6].push(user);
        break;
      case 7:
        examScoreSegInfo[7].push(user);
        break;
      case 8:
        examScoreSegInfo[8].push(user);
        break;
      case (9, 10):
        examScoreSegInfo[9].push(user);
        break;
    }
  }
  res.status(200).json({
    examScoreSegInfo: examScoreSegInfo
    //"report":report
  });
};

/***
 * 一套考卷三种题的正确率
 */
exports.examThreeQuesAccuracy = async (req, res) => {
  try {
    var paper_id = req.query.paper_id;
    var user_paper = await Userpaper.aggregate([
      {
        $match: { paper_id: paper_id }
      },
      {
        $group: {
          _id: paper_id,
          public_score: {
            $sum: "$public_score"
          },
          subpublic_score: {
            $sum: "$subpublic_score"
          },
          professional_score: {
            $sum: "$professional_score"
          }
        }
      },
      {
        $project: {
          paper_id: 1,
          public_score: 1,
          subpublic_score: 1,
          professional_score: 1
        }
      }
    ]);
    //console.log("user_paper",user_paper)
    var paper = await Paper.findOne({ _id: paper_id });
    //console.log(paper)
    var user_paper_amount = (await Userpaper.find({ paper_id: paper_id }))
      .length;
    //console.log("amount:",user_paper_amount)
    // user_paper[0].length   //考卷数量
    let scale = paper.bank_scale;
    let publicScale = parseFloat(scale.substring(0, scale.indexOf(","))) / 100;
    let subpublicScale =
      parseFloat(
        scale.substring(scale.indexOf(",") + 1, scale.lastIndexOf(","))
      ) / 100;
    let professionalScale =
      parseFloat(scale.substring(scale.lastIndexOf(",") + 1)) / 100;

    var public_accuracy =
      user_paper[0].public_score / (user_paper_amount * (100 * publicScale)); //public正确率
    var subpublic_accuracy =
      user_paper[0].subpublic_score /
      (user_paper_amount * (100 * subpublicScale));
    var professional_accuracy =
      user_paper[0].professional_score /
      (user_paper_amount * (100 * professionalScale));

    res.status(200).json({
      public_accuracy: public_accuracy,
      subpublic_accuracy: subpublic_accuracy,
      professional_accuracy: professional_accuracy
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
/***
 *获取若干次考试各自的平均分
 */
async function getAverageScoreByPapersid(papers_id) {
  var papersAvgScore = await Userpaper.aggregate([
    {
      $match: { paper_id: { $in: papers_id } }
    },
    {
      $lookup: {
        from: "paper",
        localField: "paper_id",
        foreignField: "_id",
        as: "userpaper_paper"
      }
    },
    {
      $group: {
        _id: "$paper_id",
        paper_name: { $first: "$userpaper_paper.paper_name" },
        paper_batch: { $first: "$userpaper_paper.paper_batch" },
        paper_term: { $first: "$userpaper_paper.paper_term" },

        start_time: { $first: "$userpaper_paper.start_time" },
        paper_id: { $first: "$paper_id" },
        avg_public_score: {
          $avg: "$public_score"
        },
        avg_subpublic_score: {
          $avg: "$subpublic_score"
        },
        avg_professional_score: {
          $avg: "$professional_score"
        }
      }
    },
    {
      $project: {
        _id: 0,
        paper_id: 1,
        paper_name: 1,
        paper_batch:1,
        paper_term:1,
        start_time: 1,
        avg_public_score: 1,
        avg_subpublic_score: 1,
        avg_professional_score: 1,
        average_score: {
          $sum: [
            "$avg_public_score",
            "$avg_subpublic_score",
            "$avg_professional_score"
          ]
        }
      }
    },
    {
      $sort: {
        start_time: 1
      }
    }
  ]);
  return papersAvgScore;
}

/**
 * 获取某次考试成绩单
 */
async function getExamReportByPaperId(paper_id) {
  var report = await Userpaper.aggregate([
    {
      $match: { paper_id: paper_id }
    },
    {
      $lookup: {
        from: "user",
        localField: "user_id",
        foreignField: "_id",
        as: "userpaper_user"
      }
    },
    {
      $project: {
        _id: 0,
        user_id: 1,
        paper_id: 1,
        "userpaper_user.user_name": 1,
        public_score: 1,
        subpublic_score: 1,
        professional_score: 1,
        total_score: {
          $sum: ["$public_score", "$subpublic_score", "$professional_score"]
        }
      }
    }
  ]);
  return report;
}
