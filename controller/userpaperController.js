const mongoose = require("mongoose");
const Userpaper= require("../model/userpaperModel");
const PublicQues= require("../model/questionbankModel");
const SubPublicQues=require("../model/subpublicbankModel");
const ProfessionalQues=require("../model/professionalbankModel");

//const publicQues = require("../controller/questionbankController");
//const subpublicQues = require("../controller/subpublicbankController");
//const professionalQues = require("../controller/professionalbankController");
exports.generateOneUserPaper= async (req, res) => {
  try{
    let up = new Userpaper();
    up.user_id = req.body.user_id;
    up.paper_id = req.body.paper_id;

    let publicQuestions = await getPublicQues(req, res) || [];
    up.public_questions = publicQuestions.map(item => {
        return {
            ques_id: item, user_answer: 'Z'
        }
    });

    let subPublicQuestions = await getSubPublicQues(req, res) || [];
    up.subpublic_questions = subPublicQuestions.map(item => {
        return {
            ques_id: item, user_answer: 'Z'
        }
    });

    let professionalQuestions = await getProfessionalQues(req, res) || [];
    up.professional_questions = professionalQuestions.map(item => {
        return {
            ques_id: item, user_answer: 'Z'
        }
    });

    up.save();
    res.send('done successfully');
  }catch (err) {
      console.log(err);
  }
};
//exports.getPublicQues = async (req, res) => {
async function getPublicQues(req,res){
  try {
    let result = await PublicQues.aggregate([
      { $match: { grade:req.body.public_grade} },
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
    //res.status(404).json({ status: "fail", message: err });
    console.log(err);
  }
};
//exports.getSubPublicQues = async (req, res) => {
async function getSubPublicQues(req,res){
  try {
    let result = await SubPublicQues.aggregate([
      {$match: {depart_id:req.body.depart_id}},
      { $match: { grade:req.body.subpublic_grade} },
      { $sample: { size: req.body.subpublic_amount } },
      { $project: { _id: 1 } },
    ]);
    return result;
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
//exports.getProfessionalQues = async (req, res) => {
async function getProfessionalQues(req,res){
  try {
    let result = await ProfessionalQues.aggregate([
      {$match: {depart_id:req.body.depart_id}},
      {$match: {branch_id:req.body.branch_id}},
      { $match: { grade:req.body.professional_grade} },
      { $sample: { size: req.body.professional_amount } },
      { $project: { _id: 1 } },
    ]);
    return result;
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
