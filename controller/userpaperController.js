const Userpaper= require("../model/userpaperModel");
const mongoose = require("mongoose");
const publicQues = require("../controller/questionbankController");
const subpublicQues = require("../controller/subpublicbankController");
const professionalQues = require("../controller/professionalbankController");

exports.generatePublicQues = async (req, res) => {
    try {
      publicQues.getPublicQuesByGrade(req, res)

      
      const branch = await Branch.findOne({ _id:req.params.branch_id });
      //.findById(req.params.branch_id);
      res.status(200).json({
        status: "success",
        data: {
          branch,
        },
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};

exports.getAllBranches = async (req, res) => {
    const branches = await Branch.find();
  
    res.status(200).json({
      status: "success",
      results: branches.length,
      data: {
        branches,
      },
    });
};
exports.createBranch = async (req, res) => {
    try{
        const newBranch = await Branch.create(req.body);
        res.send(newBranch);
      
    }catch (err) {
        console.log(err);
    }
};
exports.deleteBranch = async (req, res) => {
    try {
      const readyToDeleteBranch = await Branch.findOneAndDelete({_id:req.params.branch_id});
      
      if (readyToDeleteBranch!= null) {
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
exports.updateBranch = async (req, res) => {
    try {
      const readyToUpdateBranch = await Branch.findOneAndUpdate({_id:req.params.branch_id},req.body,{
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        status: "success",
        data: {
            readyToUpdateBranch,
        },
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
}; 
exports.getDepartByBranch = async (req, res) => {
  Branch.aggregate([
    {
      $lookup: {
        from: 'department', //the colletion named department in the database qc of mongodb
        localField: '_id',  //the field of the collection branch which also is the model Branch in mongoose
        foreignField: 'branches', //the field of the collection department
        as: 'belongedToDepart',
      }
    },
    {
      $project: {
        _id:0,
        branch_name: 1,
        'belongedToDepart._id': 1,
        'belongedToDepart.depart_name': 1
      }
    }
  ], (err, docs) => {
    if (err) {
      //console.log('查询错误', err);
      res.status(404).json({ status: "fail", message: err });
    }
    //console.log(JSON.stringify(docs));
    res.status(200).json({
      status: "success",
      data: {
          docs,
      },
    });
  })
}
