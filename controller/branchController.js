const Branch = require("../model/branchModel");
const Depart = require("../model/departModel");
const User = require("../model/userModel");
const mongoose = require("mongoose");
const SubQues = require("../model/subpublicbankModel");
const ProfQues= require("../model/professionalbankModel");
const pinyin = require('pinyin');

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
// exports.createBranch = async (req, res) => {
//   try {
//     const newBranch = await Branch.create(req.body);
//     res.send(newBranch);
//   } catch (err) {
//     res.status(404).json({ status: "failed", message: err });
//   }
// };
exports.createBranch = async (req, res) => {
  try{
      let py= pinyin(req.body.branch_name, {
        style: pinyin.STYLE_NORMAL, // 设置拼音风格
      });
      let translate='';
      for(let i=0;i<py.length;i++){
        translate=translate+py[i][0]
      }
      
      req.body._id = translate;
      console.log(req.body._id)
      const newBranch = await Branch.create(req.body);
      res.send(newBranch);
    
  }catch (err) {
      console.log(err);
  }
};
exports.deleteBranch = async (req, res) => {
  try {
    var depart;
    var readyToDeleteBranch;
    let user = await User.findOne({branch_id:req.params.branch_id},'_id');
    let quess = await ProfQues.findOne({branch_id:req.params.branch_id},'_id');
    //console.log("branch:"+req.params.branch_id)
     //console.log("usr:"+user)
     //console.log("qs:"+quess)
    if(user===null&&quess===null){
      
        //-------delete the branch from the field branches of the depart which has connected to this branch
        depart = await belongedToWhichDepart(req.params.branch_id);//get the depart which connected to the branch to be deleted
     
        //console.log("--------->>>>>>>"+Object.keys(depart[0]))
      
        if(depart[0].belongedToDepart[0]!=null){
          let depart_id = depart[0].belongedToDepart[0]._id;           //obtain the _id of the depart
          //console.log("depart_id:"+depart_id)
          // const originalDepart = await Depart.findOne({_id:depart_id});
          // for(let i=0;i<originalDepart.branches.length;i++){
          //   let branch = originalDepart.branches.pop();
          //   if(branch!=req.params.branch_id){
          //     originalDepart.branches.push(branch);}
          // }
          // await originalDepart.save();
          const originalDepart = await Depart.findOne({_id:depart_id});
          let index = originalDepart.branches.findIndex(item=>{
            return item===req.params.branch_id
          });
        
          originalDepart.branches.splice(index,1);
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

