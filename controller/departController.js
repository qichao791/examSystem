const Depart= require("../model/departModel");
const mongoose = require("mongoose");
const User = require("../model/userModel");
const SubQues = require("../model/subpublicbankModel");
const ProfQues= require("../model/professionalbankModel");
const pinyin = require('pinyin');

exports.getDepart = async (req, res) => {
    try {
      const depart = await Depart.findOne({ _id:req.params.depart_id});
      res.status(200).json({
        status: "success",
        depart,
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};

exports.getAllDeparts = async (req, res) => {
  try {
     const departs = await Depart.find();
    res.status(200).json({
      status: "success",
      results: departs.length,
      departs,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
// exports.createDepart = async (req, res) => {
//     try{
        
//         const newDepart = await Depart.create(req.body);
//         res.send(newDepart);
      
//     }catch (err) {
//         console.log(err);
//     }
// };
exports.createDepart = async (req, res) => {
  try{
      let py= pinyin(req.body.depart_name, {
        style: pinyin.STYLE_NORMAL, // 设置拼音风格
      });
      let translate='';
      for(let i=0;i<py.length;i++){
        translate=translate+py[i][0]
      }
      
      req.body._id = translate;
      console.log(req.body._id)
      const newDepart = await Depart.create(req.body);
      res.send(newDepart);
    
  }catch (err) {
      console.log(err);
  }
};

exports.addBranchToDepart = async (req, res) => {
  try{
    const originalDepart = await Depart.findOne({_id:req.body.depart_id});
    console.log("--->"+req.body.branch_id);
    for(let i = 0;i < req.body.branch_id.length;i++ )
        originalDepart.branches.push(req.body.branch_id[i]);
    await originalDepart.save();
    res.status(200).json({
      status: "success",
    });
  }catch (err) {
    console.log(err)
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.delBranchFromDepart = async (req, res) => {
  try{
    const user = await User.findOne({depart_id:req.body.depart_id,branch_id:req.body.branch_id});
    const ques = await ProfQues.findOne({depart_id:req.body.depart_id,branch_id:req.body.branch_id});
    if(user===null && ques===null){
      const originalDepart = await Depart.findOne({_id:req.body.depart_id});
      let index = originalDepart.branches.findIndex(item=>{
        return item===req.body.branch_id
      });
      if(index!=-1){
          originalDepart.branches.splice(index,1);
          await originalDepart.save();
      }
      res.status(200).json({
        status: "success",
      });
    }
    else{
      res.status(502).json({ status: "fail", message: "can't remove the branch" });
    }
  }catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.deleteDepart = async (req, res) => {
    try {
      var readyToDeleteDepart;
      let user = await User.findOne({depart_id:req.params.depart_id},'_id');
      let branch = await Depart.findOne({_id:req.params.depart_id},'branches');
      let ques1 = await SubQues.findOne({depart_id:req.params.depart_id},'_id');
      let ques2 = await ProfQues.findOne({depart_id:req.params.depart_id},'_id');
      console.log("usr:"+user)
      console.log("branch:"+branch)
      console.log("q1:"+ques1)
      console.log("q2:"+ques2)
      //---if the depart to be delete doesn't be connected to any user or branch, the depart canbe allowed to delete.
      if(user === null && ques1=== null && ques2=== null && branch.branches.length===0){
          readyToDeleteDepart = await Depart.findOneAndDelete({_id:req.params.depart_id});
          if (readyToDeleteDepart!= null) {
            res.status(204).json({
              status: "success",
            });
          } else {
            res.status(501).json({ status: "fail", message: "not found" });
          }
      }else{
        res.status(502).json({ status: "fail", message: "can't delete" });
      }
      
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });console.log(err)
    }
};

exports.getBranchByDepart = async (req, res) => {
  try{
      const data = await Depart.aggregate([
      {
        $lookup: {
          from: 'branch', //the colletion named branch in the database qc of mongodb
          localField: 'branches',  //the field of the collection department which also is the model Depart in mongoose
          foreignField: '_id', //the field of the collection branch
          as: 'Branches',
        }
      },
      {
        $project: {
          _id:1,
          depart_name: 1,
          'Branches._id': 1,
          'Branches.branch_name': 1
        }
      }
    ]);
    res.status(200).json({
      status: "success",
      data
    });
  }catch(err){
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.updateDepart = async (req, res) => {
  try {
    const readyToUpdateDepart = await Depart.findOneAndUpdate({ _id:req.params.depart_id},req.body,{
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      readyToUpdateDepart,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
}; 