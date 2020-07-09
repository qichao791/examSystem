const Paper= require("../model/paperModel");
const mongoose = require("mongoose");

exports.getPaper = async (req, res) => {
    try {
      const paper = await Paper.findOne({ _id:req.params.paper_id });
      res.status(200).json({
        status: "success",
        data: {
          paper,
        },
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};

exports.getAllPaperes = async (req, res) => {
    const paperes = await Paper.find();
  
    res.status(200).json({
      status: "success",
      results: paperes.length,
      data: {
        paperes,
      },
    });
};
exports.createPaper = async (req, res) => {
    try{
        const newPaper = await Paper.create(req.body);
        res.send(newPaper);
      
    }catch (err) {
        console.log(err);
    }
};
exports.deletePaper = async (req, res) => {
    try {
      const readyToDeletePaper = await Paper.findOneAndDelete({_id:req.params.paper_id});
      
      if (readyToDeletePaper!= null) {
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
      const readyToUpdatePaper = await Paper.findOneAndUpdate({_id:req.params.paper_id},req.body,{
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        status: "success",
        data: {
            readyToUpdatePaper,
        },
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
}; 
/*
exports.getDepartByPaper = async (req, res) => {
  Paper.aggregate([
    {
      $lookup: {
        from: 'department', //the colletion named department in the database qc of mongodb
        localField: '_id',  //the field of the collection Paper which also is the model Paper in mongoose
        foreignField: 'Paperes', //the field of the collection department
        as: 'belongedToDepart',
      }
    },
    {
      $project: {
        _id:0,
        Paper_name: 1,
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
*/