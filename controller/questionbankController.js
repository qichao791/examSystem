const PublicQues = require("../model/questionbankModel");
const mongoose = require("mongoose");

exports.getPublicQuesByID = async (req, res) => {
  try {
    const data = await PublicQues.findOne({ _id: req.params.ques_id });
    res.status(200).json({
      status: "success",
      data
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.getPublicQuesByGrade = async (req, res) => {
  try {
    const data = await PublicQues.aggregate([
      //{$match: {depart_id:req.params.depart_id}},
      //{$match: {branch_id:req.params.branch_id}},
      { $match: { grade: req.params.grade } },
      { $sample: { size: req.params.amount } },
      //{$project:{ _id:0,statement:1 }}

    ]);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
/*
exports.getQuesByDepart = async (req, res) => {
    try {
      const ques3 = await Ques.find({ques_id:req.params.ques_id});
      res.status(200).json({
        status: "success",
        data: {
          ques3,
        },
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};
*/
exports.createPublicQues = async (req, res) => {
  try {
    const newQues = await PublicQues.create(req.body);
    res.send(newQues);

  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.deletePublicQues = async (req, res) => {
  try {
    const readyToDeleteQues = await PublicQues.findOneAndDelete({ _id: req.params.ques_id });

    if (readyToDeleteQues != null) {
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
exports.updatePublicQues = async (req, res) => {
  try {
    const data = await PublicQues.findOneAndUpdate({ _id: req.params.ques_id }, req.body, {
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
exports.importQuessToPublicBank = async(req,res) =>{ 
  //var xl = require('xlsx');
  //var fs = require('fs');
  //var xlsxFileName = req.body.fileName;
  //var workbook = xl.readFile(xlsxFileName)
  //const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']

  // 根据表名获取对应某张表

  //const worksheet = workbook.Sheets[sheetNames[0]];
  //var dataa =xl.utils.sheet_to_json(worksheet);

  try {
    let data = req.body.data;
    for(let i=0;i<data.length;i++){
      let ques = new PublicQues();
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

