const Depart= require("../model/departModel");
const mongoose = require("mongoose");

exports.getDepart = async (req, res) => {
    try {
      const depart = await Depart.findOne({ _id:req.params.depart_id});
      res.status(200).json({
        status: "success",
        data: {
          depart,
        },
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};

exports.getAllDeparts = async (req, res) => {
    const departs = await Depart.find();
  
    res.status(200).json({
      status: "success",
      results: departs.length,
      data: {
        departs,
      },
    });
};
exports.createDepart = async (req, res) => {
    try{
        const newDepart = await Depart.create(req.body);
        res.send(newDepart);
      
    }catch (err) {
        console.log(err);
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
        data: {
            readyToUpdateDepart,
        },
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
}; 
exports.getBranchByDepart = async (req, res) => {
    Depart.aggregate([
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
        _id:0,
        depart_name: 1,
        'Branches._id': 1,
        'Branches.branch_name': 1
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
