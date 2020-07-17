const PublicQues = require("../model/questionbankModel");
const mongoose = require("mongoose");

exports.getPublicQuesByID = async (req, res) => {
  try {
    const ques = await PublicQues.findOne({ _id: req.params.ques_id });
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
/*
exports.getQuesByGrade = async (req, res) => {
    try {
        //MyModel.find({ name: 'john', age: { $gte: 18 }});
      const ques2 = await Ques.find({depart_id:req.params.depart_id},{branch_id:req.params.branch_id},{grade:req.params.grade});
      res.status(200).json({
        status: "success",
        data: {
          ques2,
        },
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};
*/
exports.getPublicQuesByGrade = async (req, res) => {
  try {
    const questions = await PublicQues.aggregate([
      //{$match: {depart_id:req.params.depart_id}},
      //{$match: {branch_id:req.params.branch_id}},
      { $match: { grade: req.params.grade } },
      { $sample: { size: req.params.amount } },
      //{$project:{ _id:0,statement:1 }}

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
    console.log(err);
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
    const readyToUpdateQues = await PublicQues.findOneAndUpdate({ _id: req.params.ques_id }, req.body, {
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


