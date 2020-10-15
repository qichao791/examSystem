const Paper = require("../model/paperModel");
const UserPaper = require("../model/userpaperModel");
const mongoose = require("mongoose");

const PublicQues = require("../model/questionbankModel");
const SubPublicQues = require("../model/subpublicbankModel");
const ProfessionalQues = require("../model/professionalbankModel");

const Group = require("../model/groupModel");
const User = require("../model/userModel");
const Depart = require("../model/departModel");
const Branch = require("../model/branchModel");
const pinyin = require("pinyin");

exports.createPaperForGroup = async (req, res) => {
  try {
    const paper = await Paper.findOne(
      {
        paper_batch: req.body.paper_batch,
        paper_name: req.body.paper_name,
        paper_term: req.body.paper_term
      },
      "_id"
    );
   
    if (paper === null) {
      const newPaper = await Paper.create(req.body);
      req.body._id = newPaper._id;
      //res.send(newPaper);
      await reAssignPaperToGroup(req, res);

    } else {
      res.status(404).json({ status: "fail", message: "创建失败，试卷批次重复!" });
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
async function reAssignPaperToGroup (req, res) {
    try {
      let paperInfo = await Paper.findOne({ _id: req.body.paper_id });
  
      if (Date.now() - paperInfo.start_time < 0) { //if the start time of the paper with the paper_id is behind current time
        const data = await Userpaper.deleteMany({ paper_id: req.body.paper_id });//delete all the userpaper based on paper_id
  
        await createUPforGroup(req, res);//re-assign new users to the paper_id
        res.status(200).json({
          status: "success"
        });

      } else {
        res.status(204).json({
          status: "out of date"
        });
      }
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
  }
  async function createUPforGroup(req, res) {
    try {
      let users = await getUsersByGroup (req.body.group_id)
      // if there is no doc based the user_id and paper_id in the userpaper collection,
      // the new doc based on the current user_id and paper_id canbe created.
      // because the userpaper collection has the composite primery key which is user_id and paper_id.
      //So,first of all,we will delete all the old docs linked to the user_id and paper_id
      for (let i = 0; i < users.length; i++) {
        await Userpaper.findOneAndDelete({
          user_id: users[i]._id,
          paper_id: req.body.paper_id,
        });
      }
      //get the user_id from the user_list one by one. then call generateUPforOneUser function
      for (let j = 0; j < users.length; j++) {
        req.body.user_id = users[j];
        let depart_branch = await User.findOne({ _id: req.body.user_id }, 'depart_id branch_id');
        req.body.depart_id = depart_branch.depart_id;
        req.body.branch_id = depart_branch.branch_id;
        await generateUPforOneUser(req, res);
      }
     
      return true;
    } catch (err) {
      return false;
    }
  };
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
      let subpublicScale = parseInt(scale.substring(scale.indexOf(",") + 1, scale.lastIndexOf(","))) / 100;
      //let professionalScale = parseInt(scale.substring(scale.lastIndexOf(",") + 1)) / 100;
  
      req.body.public_amount = Math.round(onepaper.amount * publicScale);
      req.body.subpublic_amount = Math.round(onepaper.amount * subpublicScale);
      req.body.professional_amount =
        onepaper.amount - req.body.public_amount - req.body.subpublic_amount;
      req.body.grade = onepaper.grade;
      req.body.knowlege= onepaper.knowlege;
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
      // get the questions from sub public question bank and construct the subpublic_questions field of userpaper
      let subPublicQuestions = (await getSubPublicQues(req, res)) || [];
      up.subpublic_questions = subPublicQuestions.map((item) => {
        return {
          //ques_id: item,
          ques_id: item._id,
          user_answer: "Z",
        };
      });
      // get the questions from professional question bank and construct the professional_questions field of userpaper
      let professionalQuestions = (await getProfessionalQues(req, res)) || [];
      up.professional_questions = professionalQuestions.map((item) => {
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
  };
  async function getUsersByGroup (group_id) {
    try {
      const data = await Group.aggregate([
        {
          $lookup: {
            from: "user",
            localField: "users",
            foreignField: "_id",
            as: "Users",
          },
        },
        {
          $match: {
            _id: group_id,
          },
        },
        {
          $project: {
            _id: 1,
            group_name: 1,
            "Users._id": 1,
          },
        },
      ]);
      /*
      for (let i = 0; i < data[0].Users.length; i++) {
        let depart = await Depart.findOne(
          { _id: data[0].Users[i].depart_id },
          "depart_name"
        );
        if (depart == null) {
          res
            .status(406)
            .json({ status: "fail", message: "can't find the depart." });
          return;
        }
        data[0].Users[i].depart_id = depart.depart_name;
        let branch = await Branch.findOne(
          { _id: data[0].Users[i].branch_id },
          "branch_name"
        );
       
        if (branch != null) {
          data[0].Users[i].branch_id = branch.branch_name;
        } else {
          data[0].Users[i].branch_id = null;
        }
      }*/
      return data[0].Users;
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
  };