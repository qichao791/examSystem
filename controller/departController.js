const Depart= require("../model/departModel");
const mongoose = require("mongoose");

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
exports.createDepart = async (req, res) => {
    try{
        const newDepart = await Depart.create(req.body);
        res.send(newDepart);
      
    }catch (err) {
        console.log(err);
    }
};
exports.addBranchToDepart = async (req, res) => {
  try{
    const originalDepart = await Depart.findOne({_id:req.body.depart_id});
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
    const originalDepart = await Depart.findOne({_id:req.body.depart_id});
    for(let i=0;i<originalDepart.branches.length;i++){
      let branch = originalDepart.branches.pop();
      if(branch!=req.body.branch_id)
         originalDepart.branches.push(branch);
    }
    await originalDepart.save();
    res.status(200).json({
      status: "success",
    });
  }catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.deleteDepart = async (req, res) => {
    try {
      const readyToDeleteDepart = await Depart.findOneAndDelete({_id:req.params.depart_id});
      
      if (readyToDeleteDepart!= null) {
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
    ]);console.log("----data:"+data)
    res.status(200).json({
      status: "success",
      data,
    });
  }catch(err){
    res.status(404).json({ status: "fail", message: err });
  }
}
