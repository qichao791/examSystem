const mongoose = require("mongoose");
const Userpaper = require("../model/userpaperModel");
const PublicQues = require("../model/questionbankModel");
const SubPublicQues = require("../model/subpublicbankModel");
const ProfessionalQues = require("../model/professionalbankModel");
const Paper = require("../model/paperModel");
const User = require("../model/userModel");
/**
 * author: qichao
 * date: 2020-7
 */
exports.generateUPforUsers = async (req, res) => {
  try {
    let users = req.body.userid_list;
    // if there is no doc based the user_id and paper_id in the userpaper collection,
    // the new doc based on the current user_id and paper_id canbe created.
    // because the userpaper collection has the composite primery key which is user_id and paper_id.

    for (let i = 0; i < users.length; i++) {
      await Userpaper.findOneAndDelete({
        user_id: users[i],
        paper_id: req.body.paper_id,
      });
    }
    for (let j = 0; j < users.length-1; j++) {
      req.body.user_id = users[j];
      let depart_branch = await User.findOne({_id:req.body.user_id},'depart_id branch_id');
      req.body.depart_id = depart_branch.depart_id;
      req.body.branch_id = depart_branch.branch_id;
      await generateUPforOneUser(req, res);
    }
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(404).json({ status: "failed", message: err });
  }
};
async function generateUPforOneUser(req, res) {
  try {
    //obtain the grade,bank_scale and amount from paper collection
    const onepaper = await Paper.findOne(
      {
        _id: req.body.paper_id,
      },
      "bank_scale amount grade"
    );
    //based on the bank_scale, to set up the question's amount for each question bank
    let scale = onepaper.bank_scale;
    let publicScale = parseInt(scale.substring(0, scale.indexOf(","))) / 100;
    let subpublicScale =
      parseInt(
        scale.substring(scale.indexOf(",") + 1, scale.lastIndexOf(","))
      ) / 100;
    let professionalScale =
      parseInt(scale.substring(scale.lastIndexOf(",") + 1)) / 100;

    req.body.public_amount = Math.floor(onepaper.amount * publicScale);
    req.body.subpublic_amount = Math.floor(onepaper.amount * subpublicScale);
    req.body.professional_amount =
      onepaper.amount - req.body.public_amount - req.body.subpublic_amount;
    req.body.grade = onepaper.grade;
    //console.log("++++++"+req.body.public_amount+","+req.body.subpublic_amount)
    // create each field of the userpaper collection
    let up = new Userpaper();
    up.user_id = req.body.user_id;
    up.paper_id = req.body.paper_id;
    // get the questions from public question bank and construct the public_questions field of userpaper
    let publicQuestions = (await getPublicQues(req, res)) || [];
    up.public_questions = publicQuestions.map((item) => {
      return {
        ques_id: item,
        user_answer: "Z",
      };
    });
    // get the questions from sub public question bank and construct the subpublic_questions field of userpaper
    let subPublicQuestions = (await getSubPublicQues(req, res)) || [];
    up.subpublic_questions = subPublicQuestions.map((item) => {
      return {
        ques_id: item,
        user_answer: "Z",
      };
    });
    // get the questions from professional question bank and construct the professional_questions field of userpaper
    let professionalQuestions = (await getProfessionalQues(req, res)) || [];
    up.professional_questions = professionalQuestions.map((item) => {
      return {
        ques_id: item,
        user_answer: "Z",
      };
    });
    up.begin_time = "";
    up.submit_time = "";
    up.save(); //complete a new doc of userpaper collection
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
/**
 * author: qichao
 * date: 2020-7
 */
// generate the questions based on public_amount from public question bank randomly
async function getPublicQues(req, res) {
  try {
    let result = await PublicQues.aggregate([
      { $match: { grade: req.body.grade } },
      { $sample: { size: req.body.public_amount } },
      { $project: { _id: 1 } },
    ]);
    return result;
  } catch (err) {
    console.log(err);
  }
}
/**
 * author: qichao
 * date: 2020-7
 */
// generate the questions based on subpublic_amount from sub public question bank randomly
async function getSubPublicQues(req, res) {
  try {console.log("++req.body.subpublic_amount++++"+req.body.subpublic_amount)
    //let departId = await User.findOne({_id:req.body.user_id},'depart_id');
    let result = await SubPublicQues.aggregate([
      { $match: { depart_id: req.body.user_id} },
      { $match: { grade: req.body.grade } },
      { $sample: { size: req.body.subpublic_amount } },
      { $project: { _id: 1 } },
    ]);
    return result;
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
}
/**
 * author: qichao
 * date: 2020-7
 */
// generate the questions based on professional_amount from professional question bank randomly
async function getProfessionalQues(req, res) {
  try {console.log("++req.body.professional_amount++++"+req.body.professional_amount)

    let result = await ProfessionalQues.aggregate([
      { $match: { depart_id: req.body.depart_id } },
      { $match: { branch_id: req.body.branch_id } },
      { $match: { grade: req.body.grade } },
      { $sample: { size: req.body.professional_amount } },
      { $project: { _id: 1 } },
    ]);
    return result;
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
}
//exports.getPaperByUid = async (req, res) => {
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
/**
 * author: qichao
 * date: 2020-7
 */
exports.getPaperByUid = async (req, res) => {
  try {
    console.log(req.query.user_id);
    let result = await Userpaper.aggregate([
      {
        $lookup: {
          from: "paper",
          localField: "paper_id",
          foreignField: "_id",
          as: "data",
        },
      },
      { $match: { user_id: req.query.user_id } },
      { $match: { is_finished: req.query.is_finished === "true" } },
      { $match: { "data.is_resit": req.query.is_resit === "true" } },

      {
        $addFields: {
          score: {
            $add: ["$public_score", "$subpublic_score", "$professional_score"],
          },
        }, // 再添加一个score字段，值为原有三个字段相加之和
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
          _id: 0,
          paper_id: 1,
          //public_score:1,
          //subpublic_score:1,
          //professional_score:1,
          score: 1,
          begin_time: 1,
          submit_time: 1,
          "data.paper_name": 1,
          "data.paper_batch": 1,
          "data.paper_term": 1,
          "data.duration": 1,
          "data.start_time": 1,
          "data.end_time": 1,
        },
      },
    ]);
    /* the function of the loop for is same as the array.map
    let papers = [];
    for (let i = 0; i < result.length; i++) {
      let item = {
        paper_id: result[i].paper_id,
        ...result[i].data[0],
        score: result[i].score,
        submit_time:result[i].submit_time,
        begin_time:result[i].begin_time
      };
      papers.push(item);
    }
    */
    let papers = result.map((item) => {
      return {
        paper_id: item.paper_id,
        score: item.score,
        submit_time: item.submit_time,
        begin_time: item.begin_time,
        ...item.data[0],
      };
    });
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
      papers,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
/**
 * author: qichao
 * date: 2020-7
 */
exports.getPaperByPid = async (req, res) => {
  try {
    const data = await Userpaper.find({
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
/**
 * author: qichao
 * date: 2020-7
 */
exports.getPaperByUidPid = async (req, res) => {
  try {
    console.log("--pqs");
    const data = await Userpaper.findOne({
      user_id: req.query.user_id,
      paper_id: req.query.paper_id,
    });
    //--call function getQuesByQid to get the questions from 3 question bank seperatelly
    let pqs = data.public_questions; //the array pqs contains all the question ids from the public question bank.
    pqs = await getQuesByQid(pqs, PublicQues);
    let spqs = data.subpublic_questions; //the array spqs contains all the question ids from the sub public question bank.
    spqs = await getQuesByQid(spqs, SubPublicQues);
    let proqs = data.professional_questions; //the array proqs contains all the question ids from the professional question bank.
    proqs = await getQuesByQid(proqs, ProfessionalQues);
    //--

    res.status(200).json({
      status: "success",
      public_questions: {
        pqs,
      },
      sub_public_questions: {
        spqs,
      },
      professional_questions: {
        proqs,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
/**
 * author: qichao
 * date: 2020-7
 */
exports.getPublicSectionByUidPid = async (req, res) => {
  try {
    const data = await Userpaper.findOne({
      user_id: req.query.user_id,
      paper_id: req.query.paper_id,
    });
    //--call function getQuesByQid to get the questions from public question bank.
    let qs = data.public_questions; //the array qs contains all the question ids from the public question bank.
    qs = await getQuesByQid(qs, PublicQues);
    //--
    res.status(200).json({
      status: "success",
      questions: {
        qs,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
/**
 * author: qichao
 * date: 2020-7
 */
exports.getSubPublicSectionByUidPid = async (req, res) => {
  try {
    const data = await Userpaper.findOne({
      user_id: req.query.user_id,
      paper_id: req.query.paper_id,
    });
    //--call function getQuesByQid to get the questions from sub public question bank.
    let qs = data.subpublic_questions; //the array qs contains all the question ids from the sub public question bank.
    qs = await getQuesByQid(qs, SubPublicQues);

    res.status(200).json({
      status: "success",
      questions: {
        qs,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
/**
 * author: qichao
 * date: 2020-7
 */
exports.getProfessionSectionByUidPid = async (req, res) => {
  try {
    const data = await Userpaper.findOne({
      user_id: req.query.user_id,
      paper_id: req.query.paper_id,
    });
    //--call function getQuesByQid to get the questions from professional question bank.
    let qs = data.professional_questions; //the array proqs contains all the question ids from the professional question bank.
    proqs = await getQuesByQid(qs, ProfessionalQues);

    res.status(200).json({
      status: "success",
      questions: {
        qs,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
/**
 * author: qichao
 * date: 2020-7
 */
async function getQuesByQid(qs, whichquestionBank) {
  try {
    let result = [];
    for (let i = 0; i < qs.length; i++) {
      let statement = await whichquestionBank.find(
        { _id: qs[i].ques_id },
        "statement attachment"
      );
      let item = {
        ques_id: qs[i].ques_id,
        ...statement[0].statement,
        user_answer: qs[i].user_answer,
        attachment: statement[0].attachment,
      };
      result.push(item);
    }
    return result;
  } catch (err) {
    console.log(err);
  }
}
/**
 * author: qichao
 * date: 2020-7
 */
exports.deleteOneByUidPid = async (req, res) => {
  try {
    const data = await Userpaper.findOneAndDelete({
      user_id: req.query.user_id,
      paper_id: req.query.paper_id,
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
/**
 * author: qichao
 * date: 2020-7
 */
//calculate the achivevement of the paper for one user
exports.calculateByUidPid = async (req, res) => {
  try {
    let data = await Userpaper.findOne({
      user_id: req.body.user_id,
      paper_id: req.body.paper_id,
    });
    let score = 0; //the score of one question bank
    let section = req.body.section; //the value of section is 1 or 2 or 3.
    //1 means the question which will update is from public_questions field
    //2 means the question which will update is from subpublic_questions field
    //3 means the question which will update is from professional_questions field
    let totalnum =
      data.public_questions.length +
      data.subpublic_questions.length +
      data.professional_questions.length;
    // totalnum means the amount of all the questions from 3 banks
    let qs = data.public_questions;
    let whichquestionBank = PublicQues;
    if (section === 2) {
      qs = data.subpublic_questions;
      whichquestionBank = SubPublicQues;
    } else if (section === 3) {
      qs = data.professional_questions;
      whichquestionBank = ProfessionalQues;
    }
    for (let i = 0; i < qs.length; i++) {
      let info = await whichquestionBank.findOne(
        { _id: qs[i].ques_id },
        "statement"
      );
      let right_answer = info.statement.right_answer;
      if (qs[i].user_answer === right_answer) {
        score = score + 100 / totalnum; //to set the value of each question.
        score = Math.round(score); //score.toFixed(1);
      }
    }

    //-----update the user_answer--------

    if (section === 2) data.subpublic_score = score;
    else if (section === 3) data.professional_score = score;
    else data.public_score = score;

    data.save();
    res.status(200).json({ status: "calculate success" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "fail", message: err });
  }
};
/**
 * author: qichao
 * date: 2020-7
 */
//the aim of this function is to update the answer of the user gives
exports.updateOneByUidPid = async (req, res) => {
  try {
    let data = await Userpaper.findOne({
      user_id: req.body.user_id,
      paper_id: req.body.paper_id,
    });
    let section = req.body.section; //the value of section is 1 or 2 or 3.
    //1 means the question which will update is from public_questions field
    //2 means the question which will update is from subpublic_questions field
    //3 means the question which will update is from professional_questions field
    let qs = data.public_questions;
    if (section === 2) qs = data.subpublic_questions;
    else if (section === 3) qs = data.professional_questions;
    //update the score for 3 question bank seperatelly
    for (let i = 0; i < qs.length; i++) {
      if (qs[i].ques_id === req.body.ques_id) {
        qs[i].user_answer = req.body.user_answer;
        break;
      }
    }
    //-----update the user_answer--------

    if (section === 2) data.subpublic_questions = qs;
    else if (section === 3) data.professional_questions = qs;
    else data.public_questions = qs;

    data.begin_time = req.body.begin_time;
    data.submit_time = req.body.submit_time;
    data.save();
    res.status(200).json({ status: "update success" });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
/**
 * author: qichao
 * date: 2020-7
 */
exports.submitPaper = async (req, res) => {
  try {
    const data = await Userpaper.findOneAndUpdate(
      { user_id: req.body.user_id, paper_id: req.body.paper_id },
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
/**
 * author: qichao
 * date: 2020-7
 */
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
