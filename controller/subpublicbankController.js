const SubQues= require("../model/subpublicbankModel");
const Depart= require("../model/departModel");
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
exports.importQuessToSubPublicBank = async(req,res) =>{ 
  try {
    let data = req.body.data;
    for(let i=0;i<data.length;i++){
      let ques = new SubQues();
      let departId = await Depart.findOne({ depart_name:data[i].depart_name},'_id');
      ques.depart_id = departId._id;
      //getDepartIDbyName(data[i].depart_name);
      ques.statement = {
           stem: data[i].stem,
           options: data[i].options.split('$'),
           right_answer:data[i].right_answer,
      }
      ques.analysis = data[i].analysis;
      ques.knowlege = data[i].knowlege;
      ques.grade = data[i].grade;
      ques.attachment = {
           image:data[i].images.split('$'),
           voice:data[i].voices.split('$'),
           video:data[i].videos.split('$'),
      }
      await ques.save();
      res.status(200).json({
          status: "success",
      });
    }
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
}

//**author:qichao 