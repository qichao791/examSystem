const mongoose = require("mongoose");
const Userpaper = require("../model/userpaperModel");
const PublicQues = require("../model/questionbankModel");
const SubPublicQues = require("../model/subpublicbankModel");
const ProfessionalQues = require("../model/professionalbankModel");

exports.generateOneUserPaper = async (req, res) => {
  try {
    let up = new Userpaper();
    up.user_id = req.body.user_id;
    up.paper_id = req.body.paper_id;

    let publicQuestions = (await getPublicQues(req, res)) || [];
    up.public_questions = publicQuestions.map((item) => {
      return {
        ques_id: item,
        user_answer: "Z",
      };
    });

    let subPublicQuestions = (await getSubPublicQues(req, res)) || [];
    up.subpublic_questions = subPublicQuestions.map((item) => {
      return {
        ques_id: item,
        user_answer: "Z",
      };
    });

    let professionalQuestions = (await getProfessionalQues(req, res)) || [];
    up.professional_questions = professionalQuestions.map((item) => {
      return {
        ques_id: item,
        user_answer: "Z",
      };
    });

    up.save();
    res.send("done successfully");
  } catch (err) {
    console.log(err);
  }
};
//exports.getPublicQues = async (req, res) => {
async function getPublicQues(req, res) {
  try {
    let result = await PublicQues.aggregate([
      { $match: { grade: req.body.public_grade } },
      { $sample: { size: req.body.public_amount } },
      { $project: { _id: 1 } },
    ]);
    // ,(err, docs) => {
    //     if (err) {
    //       console.log('查询错误', err);
    //       return
    //     }
    //     publicQuestions = docs;
    //     console.log(JSON.stringify(docs));
    //   }

    return result;
  } catch (err) {
    console.log(err);
  }
}

async function getSubPublicQues(req, res) {
  try {
    let result = await SubPublicQues.aggregate([
      { $match: { depart_id: req.body.depart_id } },
      { $match: { grade: req.body.subpublic_grade } },
      { $sample: { size: req.body.subpublic_amount } },
      { $project: { _id: 1 } },
    ]);
    return result;
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
}

async function getProfessionalQues(req, res) {
  try {
    let result = await ProfessionalQues.aggregate([
      { $match: { depart_id: req.body.depart_id } },
      { $match: { branch_id: req.body.branch_id } },
      { $match: { grade: req.body.professional_grade } },
      { $sample: { size: req.body.professional_amount } },
      { $project: { _id: 1 } },
    ]);
    return result;
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
}
exports.getPaperByUid = async (req, res) => {
  /*try {
    const data = await Userpaper.findOne({
      user_id: req.params.user_id,
    });
    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }*/
  try {
   let result = await Userpaper.aggregate([
    {
      $lookup: {
        from: 'paper', 
        localField: 'paper_id', 
        foreignField: '_id', 
        as: 'data',
      }
    },
    { $match: { user_id: req.query.user_id } },
    { $match: { is_finished: req.query.is_finished==='true' } },
    { $match: { 'data.is_resit': req.query.is_resit==='true' }},

    {
      $addFields: { score:
        { $add: [ "$public_score", "$subpublic_score", "$professional_score" ] } } // 再添加一个score字段，值为原有三个字段相加之和
    },
    /*
         //{
         //    _id: 2,
         //    student: "Ryan",
         //    quiz: [ 8, 8 ],
         //}
    {
      $addFields: {
        totalQuiz: { $sum: "$quiz" } // 添加totalQuiz字段，值为quize数组字段的和
      }
    },
   */
    {
      $project: {
        _id:0,
        paper_id: 1,
        //public_score:1,
        //subpublic_score:1,
        //professional_score:1,
        score:1,
        'data.paper_name': 1,
        'data.paper_batch': 1,
        'data.paper_term': 1,
        'data.duration': 1,
        'data.start_time': 1,
        'data.end_time': 1,
      }
    }
  ]);
  /*
  result = result.map(item=>{
    item.score = item.public_score+item.subpublic_score+item.professional_score;
    delete item.public_score
    delete item.subpublic_score
    delete item.professional_score
    return item
  });
  */
  res.status(200).json({
    status: "success",
    data: {
      result,
    },
  });
  
 } catch (err) {
   res.status(404).json({ status: "fail", message: err });
 }
};
exports.getPaperByPid = async (req, res) => {
  try {
    const data = await Userpaper.findOne({
      paper_id: req.params.paper_id,
    });
    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.getPaperByUidPid = async (req, res) => {
  try {
    const data = await Userpaper.findOne({
      user_id: req.params.user_id,
      paper_id: req.params.paper_id,
    });
    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.getAllPapers = async (req, res) => {
  const data = await Userpaper.find();

  res.status(200).json({
    status: "success",
    results: branches.length,
    data: {
      data,
    },
  });
};
exports.deleteOnePaper = async (req, res) => {
  try {
    const data = await Userpaper.findOneAndDelete({
      user_id: req.params.user_id,
      paper_id: req.params.paper_id,
    });

    if (data != null) {
      res.status(204).json({
        status: "success",
        data: null,
      });
    } else {
      res.status(404).json({ status: "fail", message: "not found" });
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.updateOnePaper = async (req, res) => {
  try {
    const data = await Userpaper.findOneAndUpdate(
      { user_id: req.params.user_id, paper_id: req.params.paper_id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
