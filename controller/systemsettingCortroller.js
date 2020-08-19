const mongoose = require("mongoose");
const Sys = require("../model/systemsettingModel");
const User = require("../model/userModel");
/**
 * author: caohongyuan
 * date: 2020-8
 */
exports.getParameters = async (req, res) => {
    try {
      const data = await Sys.findOne();
      res.status(200).json({
        status: true,
        data
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};

exports.createParameters = async (req, res) => {
    try {
      const data = await Sys.create(req.body);
      res.status(200).json({
        status: "success",
      });
    } catch (err) {
        res.status(404).json({ status: "fail", message: err });
    }
};

exports.addParameters = async (req, res) => {
    try {
        const data = await Sys.create(req.body);
        if (data != null) {
          res.status(200).json({
            status: true
          })
        } else {
          res.status(404).json({
            status: false
          })
        }
    } catch (err) {
        res.status(404).json({ status: "fail", message: err });
    }
}

exports.modifyParameters = async (req, res) => {
    try {
      const data = await getParameters_id(req, res);
      const result = await Sys.replaceOne({ _id: data}, req.body);
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
      res.status(404).json({ status: "fail", message: err });
    }
}
async function getParameters_id (req, res) {
  try{
    const data = await Sys.findOne({}, '_id');
    return data;
  } catch (err) {
    return false;
  }
}

exports.deleteParameters = async (req, res) => {
    try {
      const readyToDeleteParameters = await Sys.findOneAndDelete({ _id: req.body._id });
      if (readyToDeleteParameters != null) {
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

