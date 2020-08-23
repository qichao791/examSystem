const ProfQues= require("../model/professionalbankModel");
const Depart= require("../model/departModel");
const Branch = require("../model/branchModel");
const mongoose = require("mongoose");

exports.getProfQuesByID = async (req, res) => {
    try {
      const data = await ProfQues.findOne({_id:req.params.ques_id});
      res.status(200).json({
        status: "success",
        data,
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};
exports.getProfQuesByDepartAndBranch = async (req, res) => {
  try{
        const data = await ProfQues.aggregate([ 
            {$match: {depart_id:req.body.depart_id}},
            {$match: {branch_id:req.body.branch_id}},
            //{$match: {grade:req.query.grade}},
            //{$sample: { size: req.query.amount}}, 
            //{$project:{ _id:0,ques_id:1 }}
          
        ]);
        res.status(200).json({
            status: "success",
            data,
        });
  } catch (err) {console.log(err)
      res.status(404).json({ status: "fail", message: err });
  }
};
exports.getProfQuesByGrade = async (req, res) => {
  try{
    var data;
    if(req.body.amount==null){
        data = await ProfQues.find({
              grade:req.body.grade,
              depart_id:req.body.depart_id,
              branch_id:req.body.branch_id
        });
    }else{
        data = await ProfQues.aggregate([ 
            {$match: {depart_id:req.body.depart_id}},
            {$match: {branch_id:req.body.branch_id}},
            {$match: {grade:req.body.grade}},
            {$sample: { size: req.body.amount}}, 
            //{$project:{ _id:0,ques_id:1 }}
          
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
//fuzzy search based on the stem.
exports.getLikeQuestion = async (req, res) => {
  try {
     var reg = new RegExp(req.body.stem);
     const result = await ProfQues.find({'statement.stem':{$regex: reg}});
     res.status(200).json({
      status: "success",
      result,
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.createProfQues = async (req, res) => {
    try{
        const data = await ProfQues.create(req.body);
        res.send(data);
      
    }catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};
exports.deleteProfQues = async (req, res) => {
    try {
      const readyToDeleteQues = await ProfQues.findOneAndDelete({_id:req.params.ques_id});
      
      if (readyToDeleteQues!= null) {
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
exports.updateProfQues = async (req, res) => {
    try {
      const data = await ProfQues.findOneAndUpdate({_id:req.params.ques_id},req.body,{
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        status: "success",
        data
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
}; 
exports.importQuessToProfessionalBank = async(req,res) =>{ 
  try{
    let data = req.body;
    //console.log("professionalBankData:",data)
      for(let i=0,j=0;i<data.length;i++){
        let ques = new ProfQues();  

        let departId = await Depart.findOne({ depart_name:data[i].depart_name},'_id');
        // let branchId_list = await Branch.find({ branch_name:data[i].branch_name},'_id');
        // ques.depart_id = departId._id;
        // for(j=0;j<branchId_list.length;j++){ 
        //   const br = await Branch.aggregate(
        //     [
        //     {
        //       $lookup: {
        //         from: "department", //the colletion named department in the database qc of mongodb
        //         localField: "_id", //the field of the collection branch which also is the model Branch in mongoose
        //         foreignField: "branches", //the field of the collection department
        //         as: "belongedToDepart",
        //       },
        //     },
        //     {
        //       $match:{_id:branchId_list[j]._id}
        //     },
        //     {
        //       $project: {
        //         _id: 0,
        //         "belongedToDepart._id": 1,
        //       },
        //     },
        //   ]);
        
        //   if(br[0].belongedToDepart[0]._id==ques.depart_id){
        //       break;
        //   }
        let branchId = await Branch.findOne({ branch_name:data[i].branch_name},'_id');
        ques.depart_id = departId._id;
        ques.branch_id = branchId._id;
        ques.statement = {
            stem: data[i].stem,
            options: data[i].options.split('$'),
            right_answer:data[i].right_answer,
        }
 
        if("undefined" == typeof data[i].analysis || data[i].analysis===null)
            ques.analysis='';
        else
            ques.analysis = data[i].analysis;
        if("undefined" == typeof data[i].knowlege || data[i].knowlege===null)
            ques.knowlege='';
        else
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
        
       
      }res.status(200).json({
        status: "success",
      });
     
  } catch (err) {
        res.status(404).json({ status: "fail", message: err });console.log(err)
  }
}