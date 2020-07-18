const Paper = require("../model/paperModel");
const UserPaper = require("../model/userpaperModel")
const mongoose = require("mongoose");

exports.getPaper = async (req, res) => {
  try {
    const paper = await Paper.findOne({ _id: req.params.paper_id });
    res.status(200).json({
      status: true,
      paper
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};


exports.getAllPapers = async (req, res) => {
  const paperes = await Paper.find();

  res.status(200).json({
    status: "success",
    results: paperes.length,
    data: {
      paperes,
    },
  });
};
exports.createPaper = async (req, res) => {
  try {
    const newPaper = await Paper.create(req.body);
    res.send(newPaper);

  } catch (err) {
    console.log(err);
  }
};

exports.addPaper = async (req, res) => {
  try {
    const newPaper = await Paper.create(req.body);
    //console.log("newPaper",newPaper)
    if (newPaper != null) {
      res.status(200).json({
        status: true
      })
    } else {
      res.status(200).json({
        status: false
      })
    }

  } catch (err) {
    console.log(err);
  }
};

exports.modifyPaper = async (req, res) => {
  try {
    const result = await Paper.replaceOne({ _id: req.body.paper_id }, req.body);
    console.log("result", result)
    if (result.nModified == 1) {
      res.status(200).json({
        status: "true",
      })
    } else {
      res.status(200).json({
        status: "false",
      })
    }
  } catch (err) {
    console.log(err)
    res.status(200).json({
      status: "false",
    })
  }
}

exports.removePaper = async (req, res) => {
  var paper_id = req.query.paper_id
  var userpaper = await UserPaper.find({ paper_id: req.query.paper_id })
  console.log("userpaper:", userpaper)
  if (userpaper.length == 0) {
    await Paper.findByIdAndDelete({ _id:paper_id })
    res.status(200).json({
      status:true
    })
  }else{
    res.status(200).json({
      status:false
    })
  }
}



exports.deletePaper = async (req, res) => {
  try {
    const readyToDeletePaper = await Paper.findOneAndDelete({ _id: req.params.paper_id });

    if (readyToDeletePaper != null) {
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
exports.updatePaper = async (req, res) => {
  try {
    const readyToUpdatePaper = await Paper.findOneAndUpdate({ _id: req.params.paper_id }, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        readyToUpdatePaper,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
}; 
