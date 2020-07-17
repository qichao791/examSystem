const ProfQues= require("../model/professionalbankModel");
const mongoose = require("mongoose");

exports.getProfQuesByID = async (req, res) => {
    try {
      const ques = await ProfQues.findOne({_id:req.params.ques_id});
      res.status(200).json({
        status: "success",
        data: {
          ques,
        },
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};
exports.getProfQuesByGrade = async (req, res) => {
  try{
        const questions= await ProfQues.aggregate([ 
            {$match: {depart_id:req.params.depart_id}},
            {$match: {branch_id:req.params.branch_id}},
            {$match: {grade:req.params.grade}},
            {$sample: { size: req.params.amount}}, 
            //{$project:{ _id:0,ques_id:1 }}
          
        ]);
        res.status(200).json({
            status: "success",
            data: {
                questions,
            },
        });
  } catch (err) {
      res.status(404).json({ status: "fail", message: err });
  }
};
exports.createProfQues = async (req, res) => {
    try{
        const newQues = await ProfQues.create(req.body);
        res.send(newQues);
      
    }catch (err) {
        console.log(err);
    }
};
exports.deleteProfQues = async (req, res) => {
    try {
      const readyToDeleteQues = await ProfQues.findOneAndDelete({_id:req.params.ques_id});
      
      if (readyToDeleteQues!= null) {
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
exports.updateProfQues = async (req, res) => {
    try {
      const readyToUpdateQues = await ProfQues.findOneAndUpdate({_id:req.params.ques_id},req.body,{
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        status: "success",
        data: {
            readyToUpdateQues,
        },
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
}; 

