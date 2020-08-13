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
//get the papers between the start year and month and end year and month,eg. [2020-7,2020-9]
exports.getPapersByYearAndMonth = async (req, res) => {
  try {
    const papers = await Paper.find({ start_time: {$gte: req.body.startTime, $lte: req.body.endTime}});
    res.status(200).json({
      status: true,
      papers:papers || []
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
      "paper_batch": { $regex: reg } //$regex用于实现模糊查询
    });
    res.status(200).json({
      status: "success",
      papers:papers || []
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.getAllPapers = async (req, res) => {
  try{
    const paperes = await Paper.find();

    res.status(200).json({
      status: "success",
      results: paperes.length,
      paperes,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.createPaper = async (req, res) => {
  try {
    const newPaper = await Paper.create(req.body);
    res.send(newPaper);

  } catch (err) {
      res.status(404).json({ status: "fail", message: err });
  }
};

exports.addPaper = async (req, res) => {
  //console.log(req)
  try {
    const newPaper = await Paper.create(req.body);
    //console.log("newPaper",newPaper)
    if (newPaper != null) {
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
};

exports.modifyPaper = async (req, res) => {
  try {
    const result = await Paper.replaceOne({ _id: req.body.paper_id }, req.body);
    //console.log("result", result)
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

exports.removePaper = async (req, res) => {
  try{
    var paper_id = req.query.paper_id
    var userpaper = await UserPaper.find({ paper_id: req.query.paper_id })

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
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
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
      readyToUpdatePaper,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
}; 
/**
 * author: caohongyuan
 * date: 2020-8
 */
//based on the selected paper, the function of this method is to get the paper with the same 'paper_name' and the 'paper_batch' is the last one 
//of the selected paper's.
exports.getBatch = async (req, res) => {
  try {
    var paper_name = req.body.paper_name;
    var paper_batch1 = req.body.paper_batch;
    var data1 = await Paper.findOne({
      paper_name: paper_name,
      paper_batch: paper_batch1,
    },'_id paper_name paper_batch paper_term');   
    if (data1 != null) {
      // if this exam is not the first time of the month
      if (paper_batch1.substring(paper_batch1.indexOf("第") + 1, paper_batch1.indexOf("次")) != 1) 
      {
        var paper_bench2 = paper_batch1.replace(paper_batch1[paper_batch1.indexOf("第") + 1] , paper_batch1[paper_batch1.indexOf("第") + 1] - 1);
        var data2 = await Paper.findOne({
          paper_name: paper_name,
          paper_batch: paper_bench2,
        },'_id paper_name paper_batch paper_term');
        if (data2 != null) {
          res.status(200).json({
            status: "success",
            data1,
            data2,
          });
        } 
      }// if this exam is the first time of the month 
        else if (paper_batch1.substring(paper_batch1.indexOf("第") + 1, paper_batch1.indexOf("次")) == 1)
        {
          // if this exam is not the first time of the year
          if (paper_batch1.split("月")[0] != 1){
            const result1 = await Paper.find({
              paper_term: data1.paper_term,
              paper_name: paper_name,
            },'_id paper_name paper_batch paper_term');
            var max = 1;
            for (var i = 0; i < result1.length; i++){
              var time = (result1[i].paper_batch).split("月")[0]; 
              if (time > max && time < paper_batch1.split("月")[0]){
                var max = time;
              }
            }
            console.log(max);
            const reg = new RegExp(max + "月", 'g');
            const result2 = await Paper.find({
              'paper_batch' : { $regex: reg },
              paper_name: paper_name,
            },'_id paper_name paper_batch paper_term');
            var Max = 1;
            for (var i = 0; i < result2.length; i++){
              var time = (result2[i].paper_batch).substring((result2[i].paper_batch).indexOf("第") + 1, (result2[i].paper_batch).indexOf("次"));
              if(time > Max){
                var Max = time;
                var data2 = result2[i];
              }
            }
            res.status(200).json({
              status: "success",
              data1,
              data2,
            });
          // if this exam is the first time of the year
          } else {
            const result1 = await Paper.find({
              paper_term: (data1.paper_term) - 1,
              paper_name: paper_name,
            },'_id paper_name paper_batch paper_term');
            var max = 1;
            for (var i = 0; i < result1.length; i++){
              var time = (result1[i].paper_batch).split("月")[0]; 
              if (time > max){
                var max = time;
              }
            }
            const reg = new RegExp(max + "月", 'g');
            const result2 = await Paper.find({
              'paper_batch' : { $regex: reg },
              paper_name: paper_name,
            },'_id paper_name paper_batch paper_term');
            var Max = 1;
            for (var i=0; i < result2.length; i++){
              var time = (result2[i].paper_batch).substring( (result2[i].paper_batch).indexOf("第") + 1, (result2[i].paper_batch).indexOf("次"));
              if(time > Max){
                var Max = time;
                var data2 = result2[i];
              }
            }
            res.status(200).json({
              status: "success",
              data1,
              data2,
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