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

exports.getStatementByKeyWords = async (req, res) => {
  try{
    //const stem = await PublicQues.find({'statement.stem': new RegExp(req.body.keywords)});
    const stem = new RegExp(req.body.keywords, 'g');
    //RegExp对象表示正则表达式，它可以对字符串执行模式匹配，‘g’表示执行全局配置
    const result = await PublicQues.find({
        'statement.stem' : { $regex: stem } //$regex用于实现模糊查询
    })
    res.status(200).json({
      status: "success",
      result
    });
  } catch(err) {
      res.status(404).json({ status: "fail", message: err });
  }
}


