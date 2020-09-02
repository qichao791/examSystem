const User = require("../model/userModel");
const PublicQues = require("../model/questionbankModel");
const SubQues = require("../model/subpublicbankModel");
const ProfQues = require("../model/professionalbankModel");
const Admin = require("../model/adminModel");
var fs = require("fs");
const e = require("express");
const { get } = require("http");

exports.adminLogin = async (req, res) => {
  try {
    //console.log("req.body:", req.body)
    var password = req.body.password;
    var admin = await Admin.find({ password: password });
    //console.log("admin:", admin)
    if (admin.length != 0) {
      res.status(200).json({
        status: true
      });
    } else {
      res.status(200).json({
        status: false
      });
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

/**
 * 单个添加题目
 * 根据参数bank_type，向对应题库添加
 */
exports.addQuestion = async (req, res) => {
  try {
    //console.log("req:", req)
    var ques = req.body;
    var bank_type = req.params.bank_type;
    var ques_model = await getQuesModel(bank_type);
    var result = await ques_model.create(ques);
    if (result != null) {
      res.status(200).json({
        status: true
      });
    } else {
      res.status(204).json({
        status: false
      });
    }
    //console.log("result:", result)
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
};

/**
 * 修改题目
 * 根据参数bank_type，ques_id 到对应题库中修改
 */
exports.modifyQuestion = async (req, res) => {
  try {
    var ques_id = req.query.ques_id;
    var bank_type = req.query.bank_type;
    var newques = req.body;
    var ques_model = await getQuesModel(bank_type);
    var result = await ques_model.findByIdAndUpdate({ _id: ques_id }, newques);
    if (result != null) {
      res.status(200).json({
        status: true
      });
    } else {
      res.status(200).json({
        status: false
      });
    }
  } catch (err) {
    //console.log(err)
    res.status(200).json({
      status: "false"
    });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    // console.log("deleteReq:", req)
    var ques_list = req.body.ques_list;
    var bank_type = req.body.bank_type;
    // console.log("ques_list",ques_list)
    // console.log("bank_type",bank_type)

    var ques_model = await getQuesModel(bank_type);
    for (var i = 0; i < ques_list.length; i++) {
      var ques_id = ques_list[i];
      var question = await ques_model.findById({ _id: ques_id });
      var attachment = question.attachment;
      await deleteAttachmentFile(attachment);
      await ques_model.findByIdAndDelete({ _id: ques_id });
    }
    res.status(200).json({
      status: true
    });
  } catch (err) {
    //console.log(err)
    res.status(500).json({
      status: false,
      msg: err
    });
  }
};

/**
 * 上传文件（用户头像/题目附件）
 */
exports.upLoadFile = async (req, res) => {
  //console.log("req:", req);
  try {
    //console.log("req:", req)
    var type = req.body.type;
    if (type == "avatar") {
      //上传用户头像
      var user_id = req.body.user_id;
      var avatarPath = `avatar/${req.body.user_id}.png`;
      try {
        var result = await User.findByIdAndUpdate(
          { _id: user_id },
          { $set: { avatar: avatarPath } }
        );
        if (!result) {
          //console.log(err)
          res.status(500).json({
            status: false,
            msg: "failed update user avatar "
          });
        } else {
          res.status(200).json({ status: true });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ status: false });
      }
    } else {
      //type：attachment 上传的是题目附件
      var ques_bank = req.body.ques_bank;
      var ques_id = req.body.ques_id;
      console.log("ques_bank", ques_bank)
      console.log("ques_id", ques_id)
      var fileType;
      var attachmentPath;
      var success_count = 0;
      var files = req.files;
      var ques_model = await getQuesModel(ques_bank);

      // console.log("~~~~~",files)
      for (var i = 0; i < files.length; i++) {
        if (files[i].mimetype.startsWith("image")) {
          //图像
          attachmentPath = "attachment/image/" + files[i].filename; //拼接图像存储路径
        } else if (files[i].mimetype.startsWith("video")) {
          //视频
          attachmentPath = "attachment/video/" + files[i].filename;
        } else if (files[i].mimetype.startsWith("audio")) {
          //音频
          attachmentPath = "attachment/voice/" + files[i].filename;
        }
        //console.log("~~~~~",i)
        fileType = await getFileType(files[i].mimetype);
        // console.log("fileType:", fileType);
        var result = await upLoadAttachment(
          ques_model,
          ques_id,
          fileType,
          attachmentPath
        );
        if (result == true) {
          success_count++;
        }
      }
      if (success_count == files.length) {
        res.status(200).json({
          status: true
        });
      } else {
        res.status(200).json({
          status: false
        });
      }
    }
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    //console.log("deleteFileReq:", req)
    var type = req.body.type;
    if (type == "avatar") {
      //删除用户的头像
      var user_id = req.body.user_id;
      var avatarPath = req.body.path;
      var re = await User.findByIdAndUpdate(
        { _id: user_id },
        { $set: { avatar: null } }
      );
      if (re.avatar == null) {
        fs.unlinkSync(avatarPath);
        res.status(200).json({
          status: true
        });
      } else {
        res.status(200).json({
          status: false
        });
      }
    } else {
      var ques_bank = req.body.bank_type;
      var ques_model = await getQuesModel(ques_bank);
      var ques_id = req.body.ques_id;
      var file_type = req.body.file_type;
      var file_path = req.body.path;
      try {
        var ques = await ques_model.findById({ _id: ques_id });
        var image = [];
        var voice = [];
        var video = [];
        switch (file_type) {
          case "image":
            {
              image = await deleteElementOfArray(
                ques.attachment.image,
                file_path
              );
              ques.attachment.image = image;
              ques.save();
              fs.unlinkSync(file_path);
              res.status(200).json({
                status: true
              });
            }
            break;
          case "video":
            {
              video = await deleteElementOfArray(
                ques.attachment.video,
                file_path
              );
              ques.attachment.video = video;
              ques.save();
              fs.unlinkSync(file_path);
              res.status(200).json({
                status: true
              });
            }
            break;
          case "voice":
            {
              voice = await deleteElementOfArray(
                ques.attachment.voice,
                file_path
              );
              ques.attachment.voice = voice;
              ques.save();
              fs.unlinkSync(file_path);
              res.status(200).json({
                status: true
              });
            }
            break;
        }
      } catch (err) {
        res.status(404).json({ status: "fail", message: err });
      }
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

async function getFileType(mimetype) {
  var fileType;
  if (mimetype.startsWith("image")) {
    fileType = "image";
  } else if (mimetype.startsWith("video")) {
    fileType = "video";
  } else if (mimetype.startsWith("audio")) {
    fileType = "audio";
  }
  return fileType;
}
/**
 * 删除题目附件中的文件
 * @param {题目附件} attachment 
 */
async function deleteAttachmentFile(attachment) {
  try {
    if (attachment.image.length != 0) {
      for (var i = 0; i < attachment.image.length; i++) {
        fs.unlinkSync(attachment.image[i]);
      }
    }
    if (attachment.video.length != 0) {
      for (var i = 0; i < attachment.video.length; i++) {
        fs.unlinkSync(attachment.video[i]);
      }
    }
    if (attachment.voice.length != 0) {
      for (var i = 0; i < attachment.voice.length; i++) {
        fs.unlinkSync(attachment.voice[i]);
      }
    }
  } catch (err) {
    console.log(err)
  }

}
/**
 * 删除数组array中的element
 * @param {要操作的数组} array 
 * @param {要删除的数据} element 
 */
async function deleteElementOfArray(array, element) {
  var newArray = [];
  for (var i = 0; i < array.length; i++)
    if (array[i] != element) {
      newArray.push(array[i]);
    }
  return newArray;
}
/**
 * 上传题目附件
 * @param {题库的model} ques_model 
 * @param {题目Id} ques_id 
 * @param {附件类型} fileType 
 */
async function upLoadAttachment(ques_model, ques_id, fileType, attachmentPath) {
  var ques = await ques_model.findById(ques_id);
  switch (fileType) {
    case "image": {
      ques.attachment.image.push(attachmentPath);
      ques.save();
      return true;
    }
    case "video": {
      ques.attachment.video.push(attachmentPath);
      ques.save();
      return true;
    }
    case "voice": {
      ques.attachment.voice.push(attachmentPath);
      ques.save();
      return true;
    }
    default:
      return false;
  }
}

/**
 * 根据题库名称匹配对应的model
 * @param {题库名} ques_bank 
 */
async function getQuesModel(ques_bank) {
  var ques_model;
  switch (ques_bank) {
    case "questionbank":
      {
        ques_model = PublicQues;
      }
      break;
    case "professionalbank":
      {
        ques_model = ProfQues;
      }
      break;
    case "subpublicbank":
      {
        ques_model = SubQues;
      }
      break;
  }
  return ques_model;
}
