const Group = require("../model/groupModel");
const mongoose = require("mongoose");
const User = require("../model/userModel");
const pinyin = require("pinyin");
const Depart = require("../model/departModel");
const Branch = require("../model/branchModel");
/**
 * author: caohongyuan
 * date: 2020-8
 */
exports.createGroup = async (req, res) => {
  try {
    let py = pinyin(req.body.group_name, {
      style: pinyin.STYLE_NORMAL, // 设置拼音风格
    });
    let translate = "";
    for (let i = 0; i < py.length; i++) {
      translate = translate + py[i][0];
    }
    req.body._id = translate;
    const is_newGroup = await Group.findOne({ _id: req.body._id });
    if (is_newGroup == null) {
      const newGroup = await Group.create(req.body);
      res.status(200).json({
        status: "success",
        newGroup,
      });
    } else {
      res.status(200).json({
        status: "fail",
        message: "Group already exists",
      });
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.group_id });
    res.status(200).json({
      status: "success",
      group,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.getAllGroup = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json({
      status: "success",
      results: groups.length,
      groups,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.addUserToGroup = async (req, res) => {
  try {
    const originalGroup = await Group.findOne({ _id: req.body.group_id });
    const user_id = req.body.user_id;
    let is_update = 0;
    for (let i = user_id.length - 1; i >= 0; i--) {
      let t = 0;
      for (let j = 0; j < originalGroup.users.length; j++) {
        if (originalGroup.users[j] == user_id[i]) {
          user_id.splice(i, 1);
          t += 1;
        }
      }
      console.log(t, user_id);
      if (t === 0) {
        is_update = 1;
        originalGroup.users.push(user_id[i]);
        await originalGroup.save();
      }
    }
    console.log(user_id);
    if (user_id[0] == null && is_update == 0) {
      res.status(200).json({
        status: "fail",
        message: "User already exists",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      originalGroup,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.delUserFromGroup = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.user_id });
    if (user !== null) {
      const originalGroup = await Group.findOne(
        { _id: req.body.group_id },
        "users"
      );
      for (let i = 0; i < originalGroup.users.length; i++) {
        let index = originalGroup.users[i].includes(req.body.user_id);
        if (index === true) {
          originalGroup.users.splice(i, 1);
          await originalGroup.save();
        }
      }
      res.status(200).json({
        status: "success",
        originalGroup,
      });
    } else {
      res
        .status(406)
        .json({ status: "fail", message: "can't remove the User" });
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const newgroup = await Group.findOneAndDelete({ _id: req.query.group_id });
    res.status(200).json({
      status: "success",
      newgroup,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.getUsersByGroup = async (req, res) => {
  try {
    const data = await Group.aggregate([
      {
        $lookup: {
          from: "user",
          localField: "users",
          foreignField: "_id",
          as: "Users",
        },
      },
      {
        $match: {
          _id: req.body.group_id,
        },
      },
      {
        $project: {
          _id: 1,
          group_name: 1,
          "Users._id": 1,
          "Users.user_name": 1,
          "Users.depart_id": 1,
          "Users.branch_id": 1,
          "Users.active": 1,
        },
      },
    ]);
    for (let i = 0; i < data[0].Users.length; i++) {
      let depart = await Depart.findOne(
        { _id: data[0].Users[i].depart_id },
        "depart_name"
      );
      if (depart == null) {
        res
          .status(406)
          .json({ status: "fail", message: "can't find the depart." });
        return;
      }
      data[0].Users[i].depart_id = depart.depart_name;
      let branch = await Branch.findOne(
        { _id: data[0].Users[i].branch_id },
        "branch_name"
      );
     
      if (branch != null) {
        data[0].Users[i].branch_id = branch.branch_name;
      } else {
        data[0].Users[i].branch_id = null;
      }
    }
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

// exports.updateGroup = async (req, res) => {
//   try {
//     const readyToUpdateGroup = await Group.findOneAndUpdate({ _id:req.body.group_id},req.body,{
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json({
//       status: "success",
//       readyToUpdateGroup,
//     });
//   } catch (err) {
//     res.status(404).json({ status: "fail", message: err });
//   }
// };
