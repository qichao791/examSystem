const User = require("../model/userModel");

const mongoose = require("mongoose");

exports.getAllUsers = async (req, res) => {
  //let filter = {};
  //if (req.params.courseId)
  //  filter = { buyCourses: { $elemMatch: { course: req.params.courseId } } };
  //console.log(filter);
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
};
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    //course.findOne({_id:req.params.id});

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.createUser = async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      selected,
    },
  });
};
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({_id:req.params.id},req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
}; 
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined!",
  });
};
