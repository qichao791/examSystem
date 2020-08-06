const PublicQues = require("../model/questionbankModel");
const mongoose = require("mongoose");
//
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
/*//fuzzy search based on the stem.
exports.getLikeQuestion = async (req, res) => {
  try {
     var reg = new RegExp(req.body.stem);
     const data = await PublicQues.find({'statement.stem':{$regex: reg}});
     res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};*/
exports.getLikeQuestion = async (req, res) => {
  try{
    //const stem = await PublicQues.find({'statement.stem': new RegExp(req.body.keywords)});
    const reg = new RegExp(req.body.stem, 'g');
    //RegExp对象表示正则表达式，它可以对字符串执行模式匹配，‘g’表示执行全局配置
    const result = await PublicQues.find({
        'statement.stem' : { $regex: reg } //$regex用于实现模糊查询
    })
    res.status(200).json({
      status: "success",
      result
    });
  } catch(err) {
      res.status(404).json({ status: "fail", message: err });
  }
}

exports.getAllPublicQues = async (req, res) => {
  try {
     const data = await PublicQues.find();
     res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.getPublicQuesByGrade = async (req, res) => {
  try {
    var data;
    if(req.body.amount==null){
      data = await PublicQues.find({grade:req.body.grade});
    }else{
      data = await PublicQues.aggregate([
           { $match: { grade: req.body.grade } },
           { $sample: { size: req.body.amount } },
           //{$project:{ _id:0,statement:1 }}
      ]);
    }  
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

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
  // var xl = require('xlsx');
  // var fs = require('fs');
  // var xlsxFileName = req.body.fileName;
  // var workbook = xl.readFile(xlsxFileName)
  // const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']

  // 根据表名获取对应某张表

  // const worksheet = workbook.Sheets[sheetNames[0]];
  // var dataa =xl.utils.sheet_to_json(worksheet);

<<<<<<< HEAD
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

=======
  try {
    let data = req.body;
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
        
        var images,voices,videos;
        if(data[i].images==null)
            images=[];
        else 
            images = data[i].images.split('$')
        if(data[i].voices==null)
            voices=[];
        else
           voices=data[i].voices.split('$')
        if(data[i].videos==null)
           videos=[];
        else
           videos=data[i].videos.split('$')
        ques.attachment = {
            image:images,
            voice:voices,
            video:videos,
      
        }
       await ques.save();
    } 
    res.status(200).json({
          status: "success",
    });
  } catch (err) {
      res.status(404).json({ status: "fail", message: err });
  }
}
>>>>>>> dcdd6bc7fc95b23783b2e314c9e6a1288d880afa

