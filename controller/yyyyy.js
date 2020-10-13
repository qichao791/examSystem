const mongoose = require("mongoose");
const Userpaper = require("../model/userpaperModel");
const PublicQues = require("../model/questionbankModel");
const SubPublicQues = require("../model/subpublicbankModel");
const ProfessionalQues = require("../model/professionalbankModel");
const Paper = require("../model/paperModel");
const User = require("../model/userModel");
const { userLogin } = require("./userController");
const Depart = require("../model/departModel");
const Branch = require("../model/branchModel");
/**
 * author: qichao
 * date: 2020-7
 */
exports.generateUPforUsers = async (req, res) => {
  try {
    const result = await createUPforUsers(req, res);
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(404).json({ status: "failed", message: err });
  }
};
exports.updateGradeForThreeQuesBanks = async (req, res) => {
  try {
    await updateGradeForBank(PublicQues);
    await updateGradeForBank(SubPublicQues);
    await updateGradeForBank(ProfessionalQues);
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(404).json({ status: "failed", message: err });
  }
};
async function createUPforUsers(req, res) {
  try {
    let users = req.body.userid_list;
    // if there is no doc based the user_id and paper_id in the userpaper collection,
    // the new doc based on the current user_id and paper_id canbe created.
    // because the userpaper collection has the composite primery key which is user_id and paper_id.
    //So,first of all,we will delete all the old docs linked to the user_id and paper_id
    for (let i = 0; i < users.length; i++) {
      await Userpaper.findOneAndDelete({
        user_id: users[i],
        paper_id: req.body.paper_id,
      });
    }
    //get the user_id from the user_list one by one. then call generateUPforOneUser function
    for (let j = 0; j < users.length; j++) {
      req.body.user_id = users[j];
      let depart_branch = await User.findOne(
        { _id: req.body.user_id },
        "depart_id branch_id"
      );
      req.body.depart_id = depart_branch.depart_id;
      req.body.branch_id = depart_branch.branch_id;
      await generateUPforOneUser(req, res);
    }

    return true;
  } catch (err) {
    return false;
  }
}
async function generateUPforOneUser(req, res) {
  try {
    //obtain the grade,bank_scale and amount from paper collection
    const onepaper = await Paper.findOne(
      {
        _id: req.body.paper_id,
      },
      "bank_scale amount grade knowlege"
    );
    //based on the bank_scale, to set up the question's amount for each question bank
    let scale = onepaper.bank_scale;
    let publicScale = parseInt(scale.substring(0, scale.indexOf(","))) / 100;
    let subpublicScale =
      parseInt(
        scale.substring(scale.indexOf(",") + 1, scale.lastIndexOf(","))
      ) / 100;
    //let professionalScale = parseInt(scale.substring(scale.lastIndexOf(",") + 1)) / 100;

    req.body.public_amount = Math.round(onepaper.amount * publicScale);
    req.body.subpublic_amount = Math.round(onepaper.amount * subpublicScale);
    req.body.professional_amount =
      onepaper.amount - req.body.public_amount - req.body.subpublic_amount;
    req.body.grade = onepaper.grade;
    req.body.knowlege = onepaper.knowlege;
    // create each field of the userpaper collection
    let up = new Userpaper();
    up.user_id = req.body.user_id;
    up.paper_id = req.body.paper_id;
    // get the questions from public question bank and construct the public_questions field of userpaper
    let publicQuestions = (await getPublicQues(req, res)) || [];
    up.public_questions = publicQuestions.map((item) => {
      return {
        //ques_id: item,
        ques_id: item._id,
        user_answer: "Z",
      };
    });

    // get the questions from professional question bank and construct the professional_questions field of userpaper
    let professionalQuestions = (await getProfessionalQues(req, res)) || [];
    //--2020-10-9 adds the function to replenish quesitons from SubPublicQues,if there is no question in the current professional bank
    if (professionalQuestions.length == 0) {
      req.body.subpublic_amount = onepaper.amount - req.body.public_amount;
    } else {
      up.professional_questions = professionalQuestions.map((item) => {
        return {
          //ques_id: item,
          ques_id: item._id,
          user_answer: "Z",
        };
      });
    }
    // get the questions from sub public question bank and construct the subpublic_questions field of userpaper
    let subPublicQuestions = (await getSubPublicQues(req, res)) || [];
    up.subpublic_questions = subPublicQuestions.map((item) => {
      return {
        //ques_id: item,
        ques_id: item._id,
        user_answer: "Z",
      };
    });

    up.begin_time = "";
    up.submit_time = "";
    up.save(); //complete a new doc of userpaper collection
    return true;
  } catch (err) {
    return false;
  }
}
exports.reAssignPaperToNewUsers = async (req, res) => {
  try {
    let paperInfo = await Paper.findOne({ _id: req.body.paper_id });

    if (Date.now() - paperInfo.start_time < 0) {
      //if the start time of the paper with the paper_id is behind current time
      const data = await Userpaper.deleteMany({ paper_id: req.body.paper_id }); //delete all the userpaper based on paper_id

      await createUPforUsers(req, res); //re-assign new users to the paper_id
      res.status(200).json({
        status: "success",
      });
      //At last,update all the questions' grade of 3 question banks based on wrong times and right times of each question
      await updateGradeForBank(PublicQues);
      await updateGradeForBank(SubPublicQues);
      await updateGradeForBank(ProfessionalQues);
      //////////////////////////////////////////////////////////////////////
    } else {
      res.status(204).json({
        status: "out of date",
      });
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
/**
 *
 * @author:qichao
 * update the questions' grade of whichquestionBank
 */
async function updateGradeForBank(whichquestionBank) {
  try {
    let mycursor = await whichquestionBank.find();
    for (let j = 0; j < mycursor.length; j++) {
      let item = mycursor[j];
      let rt = item.right_times; //right times
      let wt = item.wrong_times; //wrong times
      if (rt / (rt + wt) > 0.75)
        //right ratio is greater than 0.75,the grade will be 1
        item.grade = 1;
      else if (rt / (rt + wt) < 0.25)
        //right ratio is lower than 0.25,the grade will be 3
        item.grade = 3;
      //right ratio is between [0.25,0.75], the grade will be 2
      else item.grade = 2;

      if (rt + wt >= 100000) {
        //if the current question has been did more than 100 thousand times, the right times and wrong times will be divided by 100
        //the aim is to make the value not bigger than 100 thousand in the circurmstance that the grade will not change
        rt = Math.round(rt / 100);
        wt = Math.round(wt / 100);
      }
      await item.save();
    }

    return true;
  } catch (err) {
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
    let knowlege = req.body.knowlege;
    var result;
    if (!knowlege) {
      //if knowlege is null, it means that any question selected comes from the whole public question bank
      result = await PublicQues.aggregate([
        { $match: { grade: req.body.grade } },
        { $match: { knowlege: "" } },
        { $sample: { size: req.body.public_amount } },
      ]);
    } else {
      result = await PublicQues.aggregate([
        { $match: { grade: req.body.grade } },
        { $match: { knowlege: req.body.knowlege } },
        { $sample: { size: req.body.public_amount } },
      ]);
    }
  
    //--*7-25 add*--the aim is to replenish other grade questions when the amount of current grade questions is not enough
    if (result.length < req.body.public_amount) {
      req.body.result_length = result.length;
      var replenish;
      if (!knowlege) replenish = await replenishPublicQues(req);
      else replenish = await replenishPublicQuesByKnowlege(req);

      if (replenish != null)
        for (let i = 0; i < replenish.length; i++) result.push(replenish[i]);
    }
    //--**-----------------------------
    return result;
  } catch (err) {
    return false;
    //res.status(404).json({ status: "fail", message: err });
  }
}
async function replenishPublicQues(req) {
  try {
    var result1 = null;
    var result2 = null;
    //if(result.length < req.body.public_amount){
    let amount1 = req.body.public_amount - req.body.result_length;
    if (req.body.grade == 2) {
      result1 = await PublicQues.aggregate([
        { $match: { grade: 1 } },
        { $match: { knowlege: "" } },
        { $sample: { size: amount1 } },
      ]);
      if (req.body.result_length + result1.length < req.body.public_amount) {
        let amount2 =
          req.body.public_amount - req.body.result_length - result1.length;
        result2 = await PublicQues.aggregate([
          { $match: { grade: 3 } },
          { $match: { knowlege: "" } },
          { $sample: { size: amount2 } },
        ]);
      }
    } else if (req.body.grade == 1) {
      result1 = await PublicQues.aggregate([
        { $match: { grade: 2 } },
        { $match: { knowlege: "" } },
        { $sample: { size: amount1 } },
      ]);
      if (req.body.result_length + result1.length < req.body.public_amount) {
        let amount2 =
          req.body.public_amount - req.body.result_length - result1.length;
        result2 = await PublicQues.aggregate([
          { $match: { grade: 3 } },
          { $match: { knowlege: "" } },
          { $sample: { size: amount2 } },
        ]);
      }
    } else if (req.body.grade == 3) {
      result1 = await PublicQues.aggregate([
        { $match: { grade: 2 } },
        { $match: { knowlege: "" } },
        { $sample: { size: amount1 } },
      ]);
      if (req.body.result_length + result1.length < req.body.public_amount) {
        let amount2 =
          req.body.public_amount - req.body.result_length - result1.length;
        result2 = await PublicQues.aggregate([
          { $match: { grade: 1 } },
          { $match: { knowlege: "" } },
          { $sample: { size: amount2 } },
        ]);
      }
    }
    if (result2 != null)
      for (let j = 0; j < result2.length; j++) result1.push(result2[j]);
    return result1;
  } catch (err) {
    return false;
  }
}
async function replenishPublicQuesByKnowlege(req) {
  try {
    var result1 = null;
    var result2 = null;

    let amount1 = req.body.public_amount - req.body.result_length;
    if (req.body.grade == 2) {
      result1 = await PublicQues.aggregate([
        { $match: { grade: 1 } },
        { $match: { knowlege: req.body.knowlege } },
        { $sample: { size: amount1 } },
      ]);
      if (req.body.result_length + result1.length < req.body.public_amount) {
        let amount2 =
          req.body.public_amount - req.body.result_length - result1.length;
        result2 = await PublicQues.aggregate([
          { $match: { grade: 3 } },
          { $match: { knowlege: req.body.knowlege } },
          { $sample: { size: amount2 } },
        ]);
      }
    } else if (req.body.grade == 1) {
      result1 = await PublicQues.aggregate([
        { $match: { grade: 2 } },
        { $match: { knowlege: req.body.knowlege } },
        { $sample: { size: amount1 } },
      ]);
      if (req.body.result_length + result1.length < req.body.public_amount) {
        let amount2 =
          req.body.public_amount - req.body.result_length - result1.length;
        result2 = await PublicQues.aggregate([
          { $match: { grade: 3 } },
          { $match: { knowlege: req.body.knowlege } },
          { $sample: { size: amount2 } },
        ]);
      }
    } else if (req.body.grade == 3) {
      result1 = await PublicQues.aggregate([
        { $match: { grade: 2 } },
        { $match: { knowlege: req.body.knowlege } },
        { $sample: { size: amount1 } },
      ]);
      if (req.body.result_length + result1.length < req.body.public_amount) {
        let amount2 =
          req.body.public_amount - req.body.result_length - result1.length;
        result2 = await PublicQues.aggregate([
          { $match: { grade: 1 } },
          { $match: { knowlege: req.body.knowlege } },
          { $sample: { size: amount2 } },
        ]);
      }
    }
    if (result2 != null)
      for (let j = 0; j < result2.length; j++) result1.push(result2[j]);
    return result1;
  } catch (err) {
    return false;
  }
}
/**
 * author: qichao
 * date: 2020-7
 */
// generate the questions based on subpublic_amount from sub public question bank randomly
async function getSubPublicQues(req, res) {
  try {
    let result = await SubPublicQues.aggregate([
      { $match: { depart_id: req.body.depart_id } },
      { $match: { grade: req.body.grade } },
      { $sample: { size: req.body.subpublic_amount } },
      //{ $project: { _id: 1 } },
    ]);
    //--*7-25 add*--the aim is to replenish other grade questions when the amount of current grade questions is not enough
    if (result.length < req.body.subpublic_amount) {
      req.body.result_length = result.length;
      let replenish = await replenishSubPublicQues(req);
      if (replenish != null)
        for (let i = 0; i < replenish.length; i++) result.push(replenish[i]);
    }
    //--**-----------------------------
    return result;
  } catch (err) {
    return false;
    //res.status(404).json({ status: "fail", message: err });
  }
}
async function replenishSubPublicQues(req) {
  try {
    var result1 = null;
    var result2 = null;
    let amount1 = req.body.subpublic_amount - req.body.result_length;
    if (req.body.grade == 2) {
      result1 = await SubPublicQues.aggregate([
        { $match: { grade: 1 } },
        { $match: { depart_id: req.body.depart_id } },
        { $sample: { size: amount1 } },
      ]);
      if (req.body.result_length + result1.length < req.body.subpublic_amount) {
        let amount2 =
          req.body.subpublic_amount - req.body.result_length - result1.length;
        result2 = await SubPublicQues.aggregate([
          { $match: { grade: 3 } },
          { $match: { depart_id: req.body.depart_id } },
          { $sample: { size: amount2 } },
        ]);
      }
    } else if (req.body.grade == 1) {
      result1 = await SubPublicQues.aggregate([
        { $match: { grade: 2 } },
        { $match: { depart_id: req.body.depart_id } },
        { $sample: { size: amount1 } },
      ]);
      if (req.body.result_length + result1.length < req.body.subpublic_amount) {
        let amount2 =
          req.body.subpublic_amount - req.body.result_length - result1.length;
        result2 = await SubPublicQues.aggregate([
          { $match: { grade: 3 } },
          { $match: { depart_id: req.body.depart_id } },
          { $sample: { size: amount2 } },
        ]);
      }
    } else if (req.body.grade == 3) {
      result1 = await SubPublicQues.aggregate([
        { $match: { grade: 2 } },
        { $match: { depart_id: req.body.depart_id } },
        { $sample: { size: amount1 } },
      ]);
      if (req.body.result_length + result1.length < req.body.subpublic_amount) {
        let amount2 =
          req.body.subpublic_amount - req.body.result_length - result1.length;
        result2 = await SubPublicQues.aggregate([
          { $match: { grade: 1 } },
          { $match: { depart_id: req.body.depart_id } },
          { $sample: { size: amount2 } },
        ]);
      }
    }
    if (result2 != null)
      for (let j = 0; j < result2.length; j++) result1.push(result2[j]);
    return result1;
  } catch (err) {
    return false;
  }
}
/**
 * author: qichao
 * date: 2020-7
 */
// generate the questions based on professional_amount from professional question bank randomly
async function getProfessionalQues(req, res) {
  try {
    let result = await ProfessionalQues.aggregate([
      { $match: { depart_id: req.body.depart_id } },
      { $match: { branch_id: req.body.branch_id } },
      { $match: { grade: req.body.grade } },
      { $sample: { size: req.body.professional_amount } },
      //{ $project: { _id: 1 } },
    ]);
    //--*7-25 add*--the aim is to replenish other grade questions when the amount of current grade questions is not enough
    if (result.length < req.body.professional_amount) {
      req.body.result_length = result.length;
      let replenish = await replenishProfessionalQues(req);
      if (replenish != null)
        for (let i = 0; i < replenish.length; i++) result.push(replenish[i]);
    }
    //--**-----------------------------
    return result;
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
}
async function replenishProfessionalQues(req) {
  try {
    var result1 = null;
    var result2 = null;
    let amount1 = req.body.professional_amount - req.body.result_length;
    if (req.body.grade == 2) {
      result1 = await ProfessionalQues.aggregate([
        { $match: { grade: 1 } },
        { $match: { depart_id: req.body.depart_id } },
        { $match: { branch_id: req.body.branch_id } },
        { $sample: { size: amount1 } },
      ]);
      if (
        req.body.result_length + result1.length <
        req.body.professional_amount
      ) {
        let amount2 =
          req.body.professional_amount -
          req.body.result_length -
          result1.length;
        result2 = await ProfessionalQues.aggregate([
          { $match: { grade: 3 } },
          { $match: { depart_id: req.body.depart_id } },
          { $match: { branch_id: req.body.branch_id } },
          { $sample: { size: amount2 } },
        ]);
      }
    } else if (req.body.grade == 1) {
      result1 = await ProfessionalQues.aggregate([
        { $match: { grade: 2 } },
        { $match: { depart_id: req.body.depart_id } },
        { $match: { branch_id: req.body.branch_id } },
        { $sample: { size: amount1 } },
      ]);
      if (
        req.body.result_length + result1.length <
        req.body.professional_amount
      ) {
        let amount2 =
          req.body.professional_amount -
          req.body.result_length -
          result1.length;
        result2 = await ProfessionalQues.aggregate([
          { $match: { grade: 3 } },
          { $match: { depart_id: req.body.depart_id } },
          { $match: { branch_id: req.body.branch_id } },
          { $sample: { size: amount2 } },
        ]);
      }
    } else if (req.body.grade == 3) {
      result1 = await ProfessionalQues.aggregate([
        { $match: { grade: 2 } },
        { $match: { depart_id: req.body.depart_id } },
        { $match: { branch_id: req.body.branch_id } },
        { $sample: { size: amount1 } },
      ]);
      if (
        req.body.result_length + result1.length <
        req.body.professional_amount
      ) {
        let amount2 =
          req.body.professional_amount -
          req.body.result_length -
          result1.length;
        result2 = await ProfessionalQues.aggregate([
          { $match: { grade: 1 } },
          { $match: { depart_id: req.body.depart_id } },
          { $match: { branch_id: req.body.branch_id } },
          { $sample: { size: amount2 } },
        ]);
      }
    }
    if (result2 != null)
      for (let j = 0; j < result2.length; j++) result1.push(result2[j]);
    return result1;
  } catch (err) {
    return false;
  }
}
//fetch one question from any one of 3 banks randomly base on the value of quesBank. the parameter 'grade','quesBank' and 'user_id' must be included in the req.
exports.getOneQuesRandomly = async (req, res) => {
  try {
    let depart_branch = await User.findOne(
      { _id: req.body.user_id },
      "depart_id branch_id"
    ); //get the 'depart_id branch_id' based on user_id
    req.body.depart_id = depart_branch.depart_id;
    req.body.branch_id = depart_branch.branch_id;
    let quesBank = req.body.section;
    let ques;
    if (quesBank === 1) {
      //if quesBank's value is 1 that means public question bank
      req.body.public_amount = 1; //
      ques = await getPublicQues(req, res);
    } else if (quesBank === 2) {
      //if quesBank's value is 1 that 2 means sub public question bank
      req.body.subpublic_amount = 1;
      ques = await getSubPublicQues(req, res);
    } else if (quesBank === 3) {
      //if quesBank's value is 1 that 3 means professional question bank
      req.body.professional_amount = 1;
      ques = await getProfessionalQues(req, res);
    }
    let data = ques[0];

    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
    console.log(err);
  }
};
/**
 * author: qichao
 * date: 2020-7
 */
exports.getPaperByUid = async (req, res) => {
  try {
    var result;
    if (req.query.is_resit == undefined && req.query.is_finished === "true") {
      result = await Userpaper.aggregate([
        {
          $lookup: {
            from: "paper",
            localField: "paper_id",
            foreignField: "_id",
            as: "data",
          },
        },
        {
          $match: {
            $and: [
              { user_id: req.query.user_id },
              { is_finished: req.query.is_finished === "true" },
            ],
          },
        },
        {
          $addFields: {
            score: {
              $add: [
                "$public_score",
                "$subpublic_score",
                "$professional_score",
              ],
            },
          }, // 再添加一个score字段，值为原有三个字段相加之和
        },
        {
          $project: {
            _id: 0,
            paper_id: 1,
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
    } else {
      result = await Userpaper.aggregate([
        {
          $lookup: {
            from: "paper",
            localField: "paper_id",
            foreignField: "_id",
            as: "data",
          },
        },
        //{ $match: { user_id: req.query.user_id } },
        //{ $match: { is_finished: req.query.is_finished === "true" } },
        //{ $match: { "data.is_resit": req.query.is_resit === "true" } },
        {
          $match: {
            $and: [
              { user_id: req.query.user_id },
              { is_finished: req.query.is_finished === "true" },
              { "data.is_resit": req.query.is_resit === "true" },
            ],
          },
        },
        {
          $addFields: {
            score: {
              $add: [
                "$public_score",
                "$subpublic_score",
                "$professional_score",
              ],
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
    }

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
      paper_id: req.body.paper_id,
    });
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.getEPInfoByPidList = async (req, res) => {
  try {
    var data = [];
    var one_exampaper;
    let papers = req.body.papers;
    let info;
    for (var i = 0; i < papers.length; i++) {
      if( !papers[i].needGroupByDepart){
        one_exampaper = await obtainOneEPInfoByPid(papers[i].paper_id);
        info = one_exampaper.map((item)=>{
          return{
            paper_name:papers[i].paper_name,
            paper_batch:papers[i].paper_batch,
            paper_term:papers[i].paper_term,
            ...item,
          }
        });
        data.push(info);
      }else{
        let result = await obtainOneEPInfoByPidGroupByDepartment(papers[i].paper_id);
        for( let j = 0; j < result.length ;j++){
          one_exampaper = result[j];
          info = one_exampaper.map((item)=>{
            return{
              paper_name:papers[i].paper_name,
              paper_batch:papers[i].paper_batch,
              paper_term:papers[i].paper_term,
              ...item,
            }
          });
          data.push(info);
        }
      }
    }
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "fail", message: err });
  }
};
/*
 **this function generates one paper's information needed by the exam report
 */
exports.getExamPaperInfoByPid = async (req, res) => {
  try {
    let data = await obtainOneEPInfoByPid(req.body.paper_id);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "fail", message: err });
  }
};
async function obtainOneEPInfoByPidGroupByDepartment(paperId) {
  try {
    let data = await obtainUsersByPidAndGroupByDepartment (paperId);
    let result=[];
    for(let i = 0; i < data.length; i++ ){
      let users = data[i].user_list;
      let totalnum = users.length;
      let presentNumber = 0;
      let absentNumber = 0;
      let highest_score = users[0].public_score + users[0].subpublic_score +users[0].professional_score;
      let lowest_score = users[0].public_score + users[0].subpublic_score +users[0].professional_score;
      let total_score = users[0].public_score + users[0].subpublic_score +users[0].professional_score;
      for(let j = 1; j < users.length; j++){
            if((users[j].public_score + users[j].subpublic_score +users[j].professional_score)>highest_score)
               highest_score = users[j].public_score + users[j].subpublic_score +users[j].professional_score;
            if((users[j].public_score + users[j].subpublic_score +users[j].professional_score)<lowest_score)
               lowest_score = users[j].public_score + users[j].subpublic_score +users[j].professional_score;
            total_score += users[j].public_score + users[j].subpublic_score +users[j].professional_score;
            if(users[j].is_finished === true)
              presentNumber++;
      }
      absentNumber = totalnum - presentNumber;
      var one_exampaper;
      one_exampaper.highest_score = highest_score
      one_exampaper.lowest_score = lowest_score
      one_exampaper.verage_score = average_score
      one_exampaper.totalnum = totalnum
      one_exampaper.presentNumber = presentNumber
      one_exampaper.absentNumber = absentNumber;
      result.push(one_exampaper);
    }
    return result;
  } catch (err) {
    return false;
  }
}
async function obtainOneEPInfoByPid(paperId) {
  try {
    let result = await Userpaper.aggregate([
      {
        $match: {
          paper_id: paperId,
        },
      },
      {
        $addFields: {
          score: {
            $add: ["$public_score", "$subpublic_score", "$professional_score"],
          },
        }, // 添加一个score字段，值为原有三个字段相加之和，即总分之意
      },
      {
        $group: {
          _id: null,
          highest_score: { $max: "$score" },
          lowest_score: { $min: "$score" },
          average_score: { $avg: "$score" },
          count: { $sum: 1 },
        },
      },
    ]);
    //the presentNumber means the amount of the users who took part in the exam
    let presentNumber = await Userpaper.aggregate([
      { $match: { paper_id: paperId } },
      { $match: { is_finished: true } },
      { $count: "number" },
    ]);
    presentNumber = presentNumber[0] ? presentNumber[0].number : 0;
    let info = result.map((item) => {
      return {
        highest_score: item.highest_score,
        lowest_score: item.lowest_score,
        average_score: item.average_score,
        totalnum: item.count,
        presentNumber: presentNumber,
        absentNumber: item.count - presentNumber,
      };
    });
    let data = info[0];
    return data;
  } catch (err) {
    return false;
  }
}
async function obtainUsersByPidAndGroupByDepartment (paperId) {
  try{
      let result = await Userpaper.aggregate([
        {
          $lookup: {
            from: "user",
            localField: "user_id",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        { $match: { paper_id: paperId } },
        {
          $project: {
            _id: 0,
            //user_id: 1,
            "userInfo._id": 1,
            "userInfo.depart_id": 1,
            "userInfo.user_name": 1,
            "userInfo.active": 1,
            public_score:1, 
            subpublic_score:1, 
            professional_score:1,
            is_finished:1
          },
        },
        //{ $group:{_id:'$userInfo.depart_id',user_list:{$push:"$userInfo"}}},//$push:"$userInfo" will only push the userInfo array into the result
        {
          $group: { _id: "$userInfo.depart_id", user_list: { $push: "$$ROOT" } },
        }, //$push:"$$ROOT" will push all the fields listed in $project into the result
      ]);
      var data = [];

      for (let i = 0; i < result.length; i++) {
        var item = {
          //depart_id: "",
          user_list: [],
        };
        //item.depart_id = result[i]._id[0];

        for (let j = 0; j < result[i].user_list.length; j++) {
          result[i].user_list[j].userInfo[0].public_score=result[i].user_list[j].public_score;
          result[i].user_list[j].userInfo[0].subpublic_score=result[i].user_list[j].subpublic_score;
          result[i].user_list[j].userInfo[0].professional_score=result[i].user_list[j].professional_score;
          result[i].user_list[j].userInfo[0].is_finished=result[i].user_list[j].is_finished;
          
          item.user_list.push(result[i].user_list[j].userInfo[0]);
        
          let departName = await Depart.findOne(
            { _id: item.user_list[j].depart_id },
            "depart_name"
          );
          item.user_list[j].depart_name = departName.depart_name;
        }
        data.push(item);
      }
      return data;
    } catch (err) {
      return false;
    }
};

//based on paper_id, this function will return some infomation from userpaper and user collection
exports.getUPinfoByPid = async (req, res) => {
  try {
    let result = await Userpaper.aggregate([
      {
        $lookup: {
          from: "user",
          localField: "user_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $match: { paper_id: req.body.paper_id } },
      {
        $addFields: {
          score: {
            $add: ["$public_score", "$subpublic_score", "$professional_score"],
          },
        },
      },
      {
        $project: {
          _id: 0,
          user_id: 1,
          score: 1,
          begin_time: 1,
          submit_time: 1,
          is_finished: 1,
          "userInfo.user_name": 1,
          "userInfo.depart_id": 1,
          "userInfo.branch_id": 1,
        },
      },
    ]);
    for (let i = 0; i < result.length; i++) {
      result[i].user_name = result[i].userInfo[0].user_name; //fetch the username from userInfo[0] and save to result[i] directly
      let depart_name = await Depart.findOne(
        { _id: result[i].userInfo[0].depart_id },
        "depart_name"
      );
      result[i].depart_name = depart_name.depart_name; //save depart name of one user to result[i] directly
      if (result[i].userInfo[0].branch_id != null) {
        let branch_name = await Branch.findOne(
          { _id: result[i].userInfo[0].branch_id },
          "branch_name"
        );
        result[i].branch_name = branch_name.branch_name; //save branch name of one user to result[i] directly
      }
      let status = 1; //1 means the user hasn't logged in system yet;
      if (result[i].is_finished === true) status = 3;
      //3 means the user has submit the paper.
      else if (result[i].begin_time.length != 0) status = 2; //2 means the user is doing the paper;
      result[i].status = status;
    }
    res.status(200).json({
      status: "success",
      result,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
//based on one paper_id, get the data from userpaper collection and group the data by depart_id
exports.getUsersByPidAndGroupByDepartment = async (req, res) => {
  try {
    let result = await Userpaper.aggregate([
      {
        $lookup: {
          from: "user",
          localField: "user_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $match: { paper_id: req.body.paper_id } },
      {
        $project: {
          _id: 0,
          //user_id: 1,
          "userInfo._id": 1,
          "userInfo.depart_id": 1,
          "userInfo.user_name": 1,
          "userInfo.active": 1,
          "userInfo.branch_id": 1,
        },
      },
      //{ $group:{_id:'$userInfo.depart_id',user_list:{$push:"$userInfo"}}},//$push:"$userInfo" will only push the userInfo array into the result
      {
        $group: { _id: "$userInfo.depart_id", user_list: { $push: "$$ROOT" } },
      }, //$push:"$$ROOT" will push all the fields listed in $project into the result
    ]);
    var data = [];

    for (let i = 0; i < result.length; i++) {
      var item = {
        depart_id: "",
        user_list: [],
      };
      item.depart_id = result[i]._id[0];
      for (let j = 0; j < result[i].user_list.length; j++) {
        item.user_list.push(result[i].user_list[j].userInfo[0]);
        let branchName = await Branch.findOne(
          { _id: item.user_list[j].branch_id },
          "branch_name"
        );
        item.user_list[j].branch_name = branchName.branch_name;
      }
      data.push(item);
    }
    //let data = await obtainUsersByPidAndGroupByDepartment (req.body.paper_id)
    res.status(200).json({
      status: "success",
      data,
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
      /*public_questions: {
        pqs,
      },
      sub_public_questions: {
        spqs,
      },
      professional_questions: {
        proqs,
      },*/
      pqs: pqs || [],
      spqs: spqs || [],
      proqs: proqs || [],
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.getThreeScoresByUidPid = async (req, res) => {
  try {
    const data = await Userpaper.findOne(
      {
        user_id: req.query.user_id,
        paper_id: req.query.paper_id,
      },
      "public_score subpublic_score professional_score"
    );

    res.status(200).json({
      status: "success",
      data,
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
      qs,
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
      qs,
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
      qs,
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
      if (statement.length) {
        let item = {
          ques_id: qs[i].ques_id,
          ...statement[0].statement,
          user_answer: qs[i].user_answer,
          attachment: statement[0].attachment,
        };
        result.push(item);
      }
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
    let user_idList = [];
    user_idList = req.body.user_list;
    for (let i = 0; i < user_idList.length; i++) {
      await Userpaper.findOneAndDelete({
        user_id: user_idList[i],
        paper_id: req.body.paper_id,
      });
    }
    res.status(204).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "fail", message: err });
  }
  /*  9-12 qichao delete
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
//9-12 qichao delete */
};
exports.deleteByPid = async (req, res) => {
  try {
    let paperInfo = await Paper.findOne({ _id: req.query.paper_id });

    if (Date.now() - paperInfo.start_time < 0) {
      const data = await Userpaper.deleteMany({ paper_id: req.query.paper_id });

      if (data != null) {
        res.status(204).json({
          status: "success",
        });
      } else {
        res.status(404).json({ status: "fail", message: "not found" });
      }
    } else {
      res.status(204).json({
        status: "out of date",
      });
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
async function calculateOneSectionByUidPid(req, res) {
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
      let originalQuestion = await whichquestionBank.findOne(
        { _id: qs[i].ques_id },
        "statement"
      );
      let right_answer = originalQuestion.statement.right_answer;
      if (qs[i].user_answer === right_answer) {
        score = score + 100 / totalnum; //to add the value of the question to score because the user did it right.
        //score = Math.round(score); //score.toFixed(1);
        originalQuestion.right_times++; //the current question is did right by the user, so the right times increases.
      } else {
        originalQuestion.wrong_times++; //the current question is did wrong by the user, so the wrong times increases.
      }
    }

    //-----update the user_answer--------
    score = Math.round(score); //score.toFixed(1);
    if (section === 2) data.subpublic_score = score;
    else if (section === 3) data.professional_score = score;
    else data.public_score = score;

    data.save();
    return true;
  } catch (err) {
    return false;
  }
}
/**
 * author: qichao
 * date: 2020-7
 */
//the aim of this function is to update the answer which the user did
exports.updateOneByUidPid = async (req, res) => {
  try {
    let data = await Userpaper.findOne({
      user_id: req.body.user_id,
      paper_id: req.body.paper_id,
    });
    //the value of section is 1 or 2 or 3.
    //1 means the question which will update is from public_questions field
    //2 means the question which will update is from subpublic_questions field
    //3 means the question which will update is from professional_questions field
    let section = req.body.section;
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
    res
      .status(200)
      .json({ is_finished: data.is_finished, status: "update success" });
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
    await Userpaper.findOneAndUpdate(
      { user_id: req.body.user_id, paper_id: req.body.paper_id },
      req.body
    );
    //call calculateAllBanksByUidPid to calculate the value of 3 question sections for one user's one paper
    const data = await calculateAllBanksByUidPid(req, res);
    /////////////////////////////////
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
/**
 * author: qichao
 * date: 2020-7
 */

async function calculateAllBanksByUidPid(req, res) {
  try {
    //loop 3 times. because there are 3 question sections which are public, subpublic, profession
    for (let i = 1; i <= 3; i++) {
      req.body.section = i;
      await calculateOneSectionByUidPid(req, res);
    }
    return true;
  } catch (err) {
    return false;
  }
}
exports.getAllPapers = async (req, res) => {
  const data = await Userpaper.find();

  res.status(200).json({
    status: "success",
    results: branches.length,
    data: data,
  });
};
/**
 * author: caohongyuan
 * date: 2020-7
 */
exports.getUserInfoByPid = async (req, res) => {
  try {
    var pid = req.body.paper_id;
    var paperid = await Userpaper.find({ paper_id: pid }, "paper_id");
    if (paperid[0] == null) {
      res.status(200).json({
        status: "false",
        message: "查无此卷",
      });
    } else {
      const data = await Userpaper.aggregate([
        {
          $lookup: {
            from: "user",
            localField: "user_id",
            foreignField: "_id",
            as: "Users",
          },
        },
        {
          $match: {
            paper_id: pid,
          },
        },
        {
          $project: {
            _id: 0,
            paper_id: 1,
            is_finished: 1,
            public_score: 1,
            subpublic_score: 1,
            professional_score: 1,
            begin_time: 1,
            submit_time: 1,
            "Users.user_name": 1,
            "Users.depart_id": 1,
            "Users.branch_id": 1,
          },
        },
      ]);
      console.log("userinfo:", data);
      res.status(200).json({
        status: "ture",
        data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
/**
 * author: caohongyuan
 * date: 2020-7
 */
exports.getUPEssentialsByPid = async (req, res) => {
  try {
    var pid = req.body.paper_id;
    const data = await Userpaper.aggregate([
      {
        $lookup: {
          from: "user",
          localField: "user_id",
          foreignField: "_id",
          as: "Users",
        },
      },
      {
        $addFields: {
          score: {
            $add: ["$public_score", "$subpublic_score", "$professional_score"],
          },
        }, // 添加一个score字段，值为原有三个字段相加之和，即总分之意
      },
      {
        $match: {
          paper_id: pid,
        },
      },
      {
        $project: {
          _id: 0,
          "Users.user_name": 1,
          "Users.depart_id": 1,
          "Users.branch_id": 1,
          is_finished: 1,
          score: 1,
        },
      },
    ]);
    //console.log("userpaper essentials:", data)
    res.status(200).json({
      status: "ture",
      data,
    });
  } catch (err) {
    console.log(err);
  }
};
/**
 * author: caohongyuan
 * date: 2020-8
 */
exports.modifyGrades = async (req, res) => {
  try {
    var data = await Userpaper.findOne({
      user_id: req.body.user_id,
      paper_id: req.body.paper_id,
    });
    //the value of section is 1 or 2 or 3.
    //1 means the question which will update is from public_score
    //2 means the question which will update is from subpublic_score
    //3 means the question which will update is from professional_score
    const section = req.body.section;
    if (section === 1) data.public_score = req.body.newscore;
    else if (section === 2) data.subpublic_score = req.body.newscore;
    else if (section === 3) data.professional_score = req.body.newscore;

    data.save();
    res.status(200).json({ status: "update success", data });
  } catch (err) {
    res.status(404).json({ status: "update fail", message: err });
  }
};
