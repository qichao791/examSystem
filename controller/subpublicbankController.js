const SubQues= require("../model/subpublicbankModel");
const mongoose = require("mongoose");
//** author:qichao
exports.getSubQuesByID = async (req, res) => {
    try {
      const data = await SubQues.findOne({_id:req.params.ques_id});
      res.status(200).json({
        status: "success",
        data,
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};
exports.getSubQuesByGrade = async (req, res) => {
  try{
        const questions= await SubQues.aggregate([ 
            {$match: {depart_id:req.params.depart_id}},
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
exports.createSubQues = async (req, res) => {
    try{
        const newQues = await SubQues.create(req.body);
        res.send(newQues);
      
    }catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};
exports.deleteSubQues = async (req, res) => {
    try {
      const readyToDeleteQues = await SubQues.findOneAndDelete({_id:req.params.ques_id});
      
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
exports.updateSubQues = async (req, res) => {
    try {
      const data = await SubQues.findOneAndUpdate({_id:req.params.ques_id},req.body,{
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        status: "success",
        data,
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
}; 
//**author:qichao 