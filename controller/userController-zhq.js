const User = require("../model/userModel");

const mongoose = require("mongoose");

exports.getAllUsers = async (req, res) => {
  let filter = {};
  if (req.params.courseId)
    filter = { buyCourses: { $elemMatch: { course: req.params.courseId } } };
  console.log(filter);
  const users = await User.find(filter).select("email");

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
  // Allow nested routes
  if (!req.body.buyCourses && !req.body.createdCourse) {
    const newUser = await User.create(req.body);
  } else if (req.body.buyCourses) {
    const selected = await User.buyCourses.push(req.body.buyCourses[0]);
  } else {
  }
  // if (!req.body.user) req.body.user = req.user.id;

  res.status(201).json({
    status: "success",
    data: {
      selected,
    },
  });
};

exports.updateUserRecords = async (req, res) => {
  const newRecords = await User.findByIdAndUpdate(req.params.id, {
    $push: {
      buyCourses: { course: req.body.buyCourses[0].course },
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      newRecords,
    },
  });
};

exports.updateUser = async (req, res) => {
  // console.log(req.body);
  // console.log(req.params.id);
  const filter = { _id: req.params.id };
  const update = { "buyCourses.course": req.body.byCourses[0].course };
  try {
    const user = await Course.findOneAndUpdate(filter, update, {
      new: true,
      // runValidators: true,
    });
    res.status(200).json({
      status: "scccess",
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
