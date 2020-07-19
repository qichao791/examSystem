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


