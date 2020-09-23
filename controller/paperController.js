const Paper = require("../model/paperModel");
const UserPaper = require("../model/userpaperModel");
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
//get the papers between the start year and month and end year and month,eg. [2020-7,2020-9]
exports.getPapersByYearAndMonth = async (req, res) => {
  try {
    const papers = await Paper.find({
      start_time: { $gte: req.body.startTime, $lte: req.body.endTime }
    });
    res.status(200).json({
      status: true,
      papers: papers || []
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.getLikePapers = async (req, res) => {
  try {
    const reg = new RegExp(req.body.batch, "g");
    //RegExp对象表示正则表达式，它可以对字符串执行模式匹配，‘g’表示执行全局配置
    const papers = await Paper.find({
      paper_batch: { $regex: reg } //$regex用于实现模糊查询
    });
    res.status(200).json({
      status: "success",
      papers: papers || []
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.getAllPapers = async (req, res) => {
  try {
    const paperes = await Paper.find().sort("-start_time");

    res.status(200).json({
      status: "success",
      results: paperes.length,
      paperes
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.createPaper = async (req, res) => {
  try {
    const paper = await Paper.findOne(
      {
        paper_batch: req.body.paper_batch,
        paper_name: req.body.paper_name,
        paper_term: req.body.paper_term
      },
      "_id"
    );
    console.log(paper);
    if (paper === null) {
      const newPaper = await Paper.create(req.body);
      res.send(newPaper);
    } else {
      res.status(404).json({ status: "fail", message: "创建失败，试卷批次重复!" });
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.addPaper = async (req, res) => {
  try {
    const paper = await Paper.findOne(
      {
        paper_batch: req.body.paper_batch,
        paper_name: req.body.paper_name,
        paper_term: req.body.paper_term
      },
      "_id"
    );
    console.log(paper);
    if (paper === null) {
      const newPaper = await Paper.create(req.body);
      res.send({ status: true, message: "success" });
    } else {
      res.status(404).json({ status: "fail", message: "创建失败，试卷批次重复!" });
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.modifyPaper = async (req, res) => {
  try {
    //判断修改的试卷名称批次年份是否和已经存在试卷重复
    var papers = Paper.find();
    console.log("papers:", papers);
    var paper_amount = papers.length;
    var isRepeat = 0;
    for (var i = 0; i < paper_amount; i++) {
      if (
        papers[i].paper_name == req.body.paper_name &&
        papers[i].paper_batch == req.body.paper_batch &&
        papers[i].paper_term == req.body.paper_term &&
        paper[i]._id != req.body.paper_id
      ) {
        isRepeat = 1;
        res.status(200).json({
          status: "false",
          message: "已经存在名称批次年份相同的试卷！两个试卷的名称批次年份不能完全相同！"
        });
      }
    }
    if (isRepeat == 0) {
      const result = await Paper.replaceOne(
        { _id: req.body.paper_id },
        req.body
      );
      //console.log("result", result)
      if (result.nModified == 1) {
        res.status(200).json({
          status: "true"
        });
      } else {
        res.status(200).json({
          status: "false"
        });
      }
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.removePaper = async (req, res) => {
  try {
    var paper_id = req.query.paper_id;
    var userpaper = await UserPaper.find({ paper_id: req.query.paper_id });

    if (userpaper.length == 0) {
      await Paper.findByIdAndDelete({ _id: paper_id });
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

exports.deletePaper = async (req, res) => {
  try {
    let paperInfo = await Paper.findOne({ _id: req.params.paper_id });
    if (Date.now() - paperInfo.start_time < 0) {
      const readyToDeletePaper = await Paper.findOneAndDelete({
        _id: req.params.paper_id,
      });

      if (readyToDeletePaper != null) {
        res.status(200).json({
          status: true,
          message: "删除成功",
        });
      } else {
        res.status(404).json({ status: "fail", message: "not found" });
      }
    } else {
      res.status(204).json({
        status: "out of date",
      });
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.updatePaper = async (req, res) => {
  try {
    const readyToUpdatePaper = await Paper.findOneAndUpdate(
      { _id: req.params.paper_id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: "success",
      readyToUpdatePaper
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
/**
 * author: caohongyuan
 * date: 2020-8
 */
//based on the current selected paper, the function of this method is to get the paper with the same 'paper_name' and the 'paper_batch'
//which is the last one of the selected paper's.
exports.getBatch = async (req, res) => {
  try {
    var paper_name = req.body.paper_name;
    var paper_batch1 = req.body.paper_batch;
    var paper_term = req.body.paper_term;
    var data1 = await Paper.findOne(
      {
        paper_name: paper_name,
        paper_batch: paper_batch1,
        paper_term: paper_term
      },
      "_id paper_name paper_batch paper_term"
    );
    if (data1 != null) {
      // if this exam is not the first time of the month
      if (
        paper_batch1.substring(
          paper_batch1.indexOf("第") + 1,
          paper_batch1.indexOf("次")
        ) != 1
      ) {
        var t = 1;
        do {
          var paper_bench2 = paper_batch1.replace(
            "第" + paper_batch1[paper_batch1.indexOf("次") - 1],
            "第" + (paper_batch1[paper_batch1.indexOf("次") - 1] - t)
          );
          var data2 = await Paper.findOne(
            {
              paper_name: paper_name,
              paper_batch: paper_bench2,
              paper_term: paper_term
            },
            "_id paper_name paper_batch paper_term"
          );
          if (
            data2 == null &&
            Number(paper_batch1[paper_batch1.indexOf("次") - 1] - t) == 1
          ) {
            res.status(404).json({
              data1,
              message: "此次考试为本月第一次考试，请更改批次名为x月第1次！"
            });
            return false;
          }
          t++;
        } while (data2 == null);
        res.status(200).json({
          status: "success",
          data1,
          data2
        });
      } else if (
        paper_batch1.substring(
          paper_batch1.indexOf("第") + 1,
          paper_batch1.indexOf("次")
        ) == 1
      ) {
        // if this exam is the first time of the month
        var month = 0;
        const result = await Paper.find(
          {
            paper_term: data1.paper_term,
            paper_name: paper_name
          },
          "_id paper_name paper_batch paper_term"
        );
        for (var i = 0; i < result.length; i++) {
          var time = result[i].paper_batch.split("月")[0];
          if (time >= month && time < Number(paper_batch1.split("月")[0])) {
            var month = time;
          }
        }
        // if this exam is not the first time of the year
        if (month != 0) {
          const reg = new RegExp(month + "月", "g");
          const result2 = await Paper.find(
            {
              paper_batch: { $regex: reg },
              paper_name: paper_name,
              paper_term: paper_term
            },
            "_id paper_name paper_batch paper_term"
          );
          var Max = 1;
          for (var i = 0; i < result2.length; i++) {
            var time = result2[i].paper_batch.substring(
              result2[i].paper_batch.indexOf("第") + 1,
              result2[i].paper_batch.indexOf("次")
            );
            if (
              time >= Max &&
              month == Number(result2[i].paper_batch.split("月")[0])
            ) {
              var Max = time;
              var data2 = result2[i];
            }
          }
          res.status(200).json({
            status: "success",
            data1,
            data2
          });
          // if this exam is the first time of the year
        } else if (month == 0) {
          var t = 1;
          var max = 1;
          do {
            var result1 = await Paper.find(
              {
                paper_term: data1.paper_term - t,
                paper_name: paper_name
              },
              "_id paper_name paper_batch paper_term"
            );
            t++;
            if (result1[0] == null && t == 30) {
              res.status(500).json({
                status: "success",
                data1,
                message: "此前无数据"
              });
            }
          } while (result1[0] == null);
          for (var i = 0; i < result1.length; i++) {
            var time = Number(result1[i].paper_batch.split("月")[0]);
            if (time > max) {
              var max = time;
            }
          }
          const reg = new RegExp(max + "月", "g");
          const result2 = await Paper.find(
            {
              paper_batch: { $regex: reg },
              paper_name: paper_name,
              paper_term: data1.paper_term - t + 1
            },
            "_id paper_name paper_batch paper_term"
          );
          var Max = 1;
          for (var i = 0; i < result2.length; i++) {
            var time = result2[i].paper_batch.substring(
              result2[i].paper_batch.indexOf("第") + 1,
              result2[i].paper_batch.indexOf("次")
            );
            if (
              time >= Max &&
              max == Number(result2[i].paper_batch.split("月")[0])
            ) {
              var Max = time;
              var data2 = result2[i];
            }
          }
          res.status(200).json({
            status: "success",
            data1,
            data2
          });
        }
      }
    } else {
      res.status(404).json({ status: "fail", message: "not found" });
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
/**
 * author: caohongyuan
 * date: 2020-9
 */
exports.getLastExamReport = async (req, res) => {
  try {
    var paper_name = req.body.paper_name;
    var paper_batch1 = req.body.paper_batch;
    var paper_term = req.body.paper_term;
    var data1 = await Paper.findOne({
      paper_name: paper_name,
      paper_batch: paper_batch1,
      paper_term: paper_term,
    },'_id paper_name paper_batch paper_term');   
    if (data1 != null) {
      // if this exam is not the first time of the month
      if (paper_batch1.substring(paper_batch1.indexOf("第") + 1, paper_batch1.indexOf("次")) != 1) 
      {       
        var t = 1;
        do{
          var paper_bench2 = paper_batch1.replace("第" + paper_batch1[paper_batch1.indexOf("次") - 1] , "第" + (paper_batch1[paper_batch1.indexOf("次") - 1] - t));
          var data2 = await Paper.findOne({
            paper_name: paper_name,
            paper_batch: paper_bench2,
            paper_term: paper_term,
          },'_id paper_name paper_batch paper_term');
          if(data2 == null && Number(paper_batch1[paper_batch1.indexOf("次") - 1] - t) == 1){
            res.status(404).json({
              data1,
              message: "此次考试为本月第一次考试，请更改批次名为x月第1次！"
            });
            return false;
          }
          t++;
        } while(data2 == null);
        const grade = await UserPaper.find({
          paper_id: data2._id
        },'public_score subpublic_score professional_score');
        var grades = new Array(10);
        for(var index = 0; index < 10; index++){
          grades[index] = 0;
        }
        for(var i = 0; i < grade.length; i++){
          grade[i] = (grade[i].public_score + grade[i].subpublic_score + grade[i].professional_score);
          if(grade[i] >= 0 && grade[i] <= 10){ grades[0]++ }     // 0-10分段
          else if(grade[i] >= 11 && grade[i] < 21){ grades[1]++ }// 11-20分段
          else if(grade[i] >= 21 && grade[i] < 31){ grades[2]++ }// 21-30分段
          else if(grade[i] >= 31 && grade[i] < 41){ grades[3]++ }// 31-40
          else if(grade[i] >= 41 && grade[i] < 51){ grades[4]++ }// 41-50
          else if(grade[i] >= 51 && grade[i] < 61){ grades[5]++ }// 51-60
          else if(grade[i] >= 61 && grade[i] < 71){ grades[6]++ }// 61-70
          else if(grade[i] >= 71 && grade[i] < 81){ grades[7]++ }// 71-80
          else if(grade[i] >= 81 && grade[i] < 91){ grades[8]++ }// 81-90
          else{ grades[9]++ }                                    // 91-100
        }
        res.status(200).json({
          status: "success",
          grades,
        });
      }// if this exam is the first time of the month 
        else if (paper_batch1.substring(paper_batch1.indexOf("第") + 1, paper_batch1.indexOf("次")) == 1)
        {
          var month = 0;
          const result = await Paper.find({
            paper_term: data1.paper_term,
            paper_name: paper_name,
          },'_id paper_name paper_batch paper_term');
          for (var i = 0; i < result.length; i++){
            var time = (result[i].paper_batch).split("月")[0]; 
            if (time >= month && time < Number(paper_batch1.split("月")[0])){
              var month = time;
            }
          }
          // if this exam is not the first time of the year
          if (month != 0){
            const reg = new RegExp(month + "月", 'g');
            const result2 = await Paper.find({
              'paper_batch' : { $regex: reg },
              paper_name: paper_name,
              paper_term: paper_term,
            },'_id paper_name paper_batch paper_term');
            var Max = 1;
            for (var i = 0; i < result2.length; i++){
              var time = (result2[i].paper_batch).substring((result2[i].paper_batch).indexOf("第") + 1, (result2[i].paper_batch).indexOf("次"));
              if(time >= Max && month == Number(result2[i].paper_batch.split("月")[0])){
                var Max = time;
                var data2 = result2[i];
              }
            }
            const grade = await UserPaper.find({
              paper_id: data2._id
            },'public_score subpublic_score professional_score');
            var grades = new Array(10);
            for(var index = 0; index < 10; index++){
              grades[index] = 0;
            }
            for(var i = 0; i < grade.length; i++){
              grade[i] = (grade[i].public_score + grade[i].subpublic_score + grade[i].professional_score);
              if(grade[i] >= 0 && grade[i] <= 10){ grades[0]++ }     // 0-10分段
              else if(grade[i] >= 11 && grade[i] < 21){ grades[1]++ }// 11-20分段
              else if(grade[i] >= 21 && grade[i] < 31){ grades[2]++ }// 21-30分段
              else if(grade[i] >= 31 && grade[i] < 41){ grades[3]++ }// 31-40
              else if(grade[i] >= 41 && grade[i] < 51){ grades[4]++ }// 41-50
              else if(grade[i] >= 51 && grade[i] < 61){ grades[5]++ }// 51-60
              else if(grade[i] >= 61 && grade[i] < 71){ grades[6]++ }// 61-70
              else if(grade[i] >= 71 && grade[i] < 81){ grades[7]++ }// 71-80
              else if(grade[i] >= 81 && grade[i] < 91){ grades[8]++ }// 81-90
              else{ grades[9]++ }                                    // 91-100
            }
            res.status(200).json({
              status: "success",
              grades,
            });
          // if this exam is the first time of the year
          } else if(month == 0){
            var t = 1;
            var max = 1;
            do{
              var result1 = await Paper.find({
                paper_term: (data1.paper_term) - t,
                paper_name: paper_name,
              },'_id paper_name paper_batch paper_term');
              t++;
              if(result1[0] == null && t == 30){
                res.status(200).json({
                  status: "success",
                  message: "此前无数据"
                });
              }
            }while(result1[0] == null);
            for (var i = 0; i < result1.length; i++){
              var time = Number((result1[i].paper_batch).split("月")[0]); 
              if (time > max){
                var max = time;
              }
            }
            const reg = new RegExp(max + "月", 'g');
            const result2 = await Paper.find({
              'paper_batch' : { $regex: reg },
              paper_name: paper_name,
              paper_term: (data1.paper_term) - t + 1,
            },'_id paper_name paper_batch paper_term');
            var Max = 1;
            for (var i = 0; i < result2.length; i++){
              var time = (result2[i].paper_batch).substring( (result2[i].paper_batch).indexOf("第") + 1, (result2[i].paper_batch).indexOf("次"));
              if(time >= Max && max == Number(result2[i].paper_batch.split("月")[0])){
                var Max = time;
                var data2 = result2[i];
              }
            }
            const grade = await UserPaper.find({
              paper_id: data2._id
            },'public_score subpublic_score professional_score');
            var grades = new Array(10);
            for(var index = 0; index < 10; index++){
              grades[index] = 0;
            }
            for(var i = 0; i < grade.length; i++){
              grade[i] = (grade[i].public_score + grade[i].subpublic_score + grade[i].professional_score);
              if(grade[i] >= 0 && grade[i] <= 10){ grades[0]++ }     // 0-10分段
              else if(grade[i] >= 11 && grade[i] < 21){ grades[1]++ }// 11-20分段
              else if(grade[i] >= 21 && grade[i] < 31){ grades[2]++ }// 21-30分段
              else if(grade[i] >= 31 && grade[i] < 41){ grades[3]++ }// 31-40
              else if(grade[i] >= 41 && grade[i] < 51){ grades[4]++ }// 41-50
              else if(grade[i] >= 51 && grade[i] < 61){ grades[5]++ }// 51-60
              else if(grade[i] >= 61 && grade[i] < 71){ grades[6]++ }// 61-70
              else if(grade[i] >= 71 && grade[i] < 81){ grades[7]++ }// 71-80
              else if(grade[i] >= 81 && grade[i] < 91){ grades[8]++ }// 81-90
              else{ grades[9]++ }                                    // 91-100
            }
            res.status(200).json({
              status: "success",
              grades,
            });
          }
        }
      } else {
        res.status(404).json({ status: "fail", message: "not found" });
      };
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};

