const Branch = require("../model/branchModel");
const Depart = require("../model/departModel");
const User = require("../model/userModel");
const mongoose = require("mongoose");
const SubQues = require("../model/subpublicbankModel");
const ProfQues= require("../model/professionalbankModel");

exports.getBranch = async (req, res) => {
 try {
    const branch = await Branch.findOne(
      { _id: req.params.branch_id}
    );
   
    res.status(200).json({
     status: "success",
     branch
    });

  } catch (err) {
    res.status(404).json({ status: "failed", message: err });
  }
};

exports.getAllBranches = async (req, res) => {
  try{
    const branches = await Branch.find();
    res.status(200).json({
      status: "success",
      //results: branches.length,
      branches,
    });
  } catch (err) {
    console.log(err)
    res.status(404).json({ status: "failed", message: err });
  }
};
exports.createBranch = async (req, res) => {
  try {
    const newBranch = await Branch.create(req.body);
    res.send(newBranch);
  } catch (err) {
    res.status(404).json({ status: "failed", message: err });
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    var depart;
    var readyToDeleteBranch;
    let user = await User.findOne({branch_id:req.params.branch_id},'_id');
    let quess = await ProfQues.findOne({_id:req.params.branch_id},'_id');
    if(user===null&&quess===null){
      
        //-------delete the branch from the field branches of the depart which has connected to this branch
        depart = await belongedToWhichDepart(req.params.branch_id);//get the depart which connected to the branch to be deleted
        //console.log("--------->>>>>>>"+Object.keys(depart[0]))
        if(depart[0].belongedToDepart[0]!=null){
          let depart_id = depart[0].belongedToDepart[0]._id;           //obtain the _id of the depart
        
          const originalDepart = await Depart.findOne({_id:depart_id});
          for(let i=0;i<originalDepart.branches.length;i++){
            let branch = originalDepart.branches.pop();
            if(branch!=req.params.branch_id){
              originalDepart.branches.push(branch);}
          }
          await originalDepart.save();
        }
        //--------------------------------------------------------------------------------

        readyToDeleteBranch = await Branch.findOneAndDelete({_id: req.params.branch_id});

        if (readyToDeleteBranch != null) {
           res.status(204).json({
            status: "success",
           });
        } else {
          res.status(501).json({ status: "fail", message: "not found" });
        }
      } else{
        res.status(502).json({ status: "fail", message: "can't delete" });
      } 
  } catch (err) {console.log(err)
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.updateBranch = async (req, res) => {
  try {
    const readyToUpdateBranch = await Branch.findOneAndUpdate(
      { _id: req.params.branch_id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      readyToUpdateBranch,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
async function belongedToWhichDepart(branch_id){
  try{
    const depart = await Branch.aggregate(
     [
      {
        $lookup: {
          from: "department", //the colletion named department in the database qc of mongodb
          localField: "_id", //the field of the collection branch which also is the model Branch in mongoose
          foreignField: "branches", //the field of the collection department
          as: "belongedToDepart",
        },
      },
      {
        $match:{_id:branch_id}
      },
      {
        $project: {
          //_id: 0,
          //branch_name: 1,
          "belongedToDepart._id": 1,
          //"belongedToDepart.depart_name": 1,
        },
      },
    ]);
    return depart;
  }catch(err){
    return false;
  }

}
exports.getDepartByBranch = async (req, res) => {
  try{
    const data = await Branch.aggregate([
      {
        $lookup: {
          from: "department", //the colletion named department in the database qc of mongodb
          localField: "_id", //the field of the collection branch which also is the model Branch in mongoose
          foreignField: "branches", //the field of the collection department
          as: "belongedToDepart",
        },
      },
      {
        $project: {
          _id: 0,
          branch_name: 1,
          "belongedToDepart._id": 1,
          "belongedToDepart.depart_name": 1,
        },
      },
    ]);

    res.status(200).json({
        status: "success",
        data
      });
  }catch(err){
    res.status(404).json({ status: "fail", message: err });
  }
};

