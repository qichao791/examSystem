const mongoose = require("mongoose");
const Userpaper = require("../model/userpaperModel");
const PublicQues = require("../model/questionbankModel");
const SubPublicQues = require("../model/subpublicbankModel");
const ProfessionalQues = require("../model/professionalbankModel");

exports.generateOneUserPaper = async (req, res) => {
  try {
    let up = new Userpaper();
    up.user_id = req.body.user_id;
    up.paper_id = req.body.paper_id;

    let publicQuestions = (await getPublicQues(req, res)) || [];
    up.public_questions = publicQuestions.map((item) => {
      return {
        ques_id: item,
        user_answer: "Z",
      };
    });

    let subPublicQuestions = (await getSubPublicQues(req, res)) || [];
    up.subpublic_questions = subPublicQuestions.map((item) => {
      return {
        ques_id: item,
        user_answer: "Z",
      };
    });

    let professionalQuestions = (await getProfessionalQues(req, res)) || [];
    up.professional_questions = professionalQuestions.map((item) => {
      return {
        ques_id: item,
        user_answer: "Z",
      };
    });
    up.begin_time = req.body.begin_time;
    up.submit_time = req.body.submit_time;
    up.save();
    res.send("done successfully");
  } catch (err) {
    console.log(err);
  }
};
//exports.getPublicQues = async (req, res) => {
async function getPublicQues(req, res) {
  try {
    let result = await PublicQues.aggregate([
      { $match: { grade: req.body.public_grade } },
      { $sample: { size: req.body.public_amount } },
      { $project: { _id: 1 } },
    ]);
    // ,(err, docs) => {
    //     if (err) {
    //       console.log('查询错误', err);
    //       return
    //     }
    //     publicQuestions = docs;
    //     console.log(JSON.stringify(docs));
    //   }

    return result;
  } catch (err) {
    console.log(err);
  }
}

async function getSubPublicQues(req, res) {
  try {
    let result = await SubPublicQues.aggregate([
      { $match: { depart_id: req.body.depart_id } },
      { $match: { grade: req.body.subpublic_grade } },
      { $sample: { size: req.body.subpublic_amount } },
      { $project: { _id: 1 } },
    ]);
    return result;
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
}

async function getProfessionalQues(req, res) {
  try {
    let result = await ProfessionalQues.aggregate([
      { $match: { depart_id: req.body.depart_id } },
      { $match: { branch_id: req.body.branch_id } },
      { $match: { grade: req.body.professional_grade } },
      { $sample: { size: req.body.professional_amount } },
      { $project: { _id: 1 } },
    ]);
    return result;
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
}
exports.getPaperByUid = async (req, res) => {
  /*try {
    const data = await Userpaper.findOne({
      user_id: req.params.user_id,
    });
    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }*/
  try {
    let result = await Userpaper.aggregate([
      {
        $lookup: {
          from: "paper",
          localField: "paper_id",
          foreignField: "_id",
          as: "data",
        },
      },
      { $match: { user_id: req.query.user_id } },
      { $match: { is_finished: req.query.is_finished === "true" } },
      { $match: { "data.is_resit": req.query.is_resit === "true" } },

      {
        $addFields: {
          score: {
            $add: ["$public_score", "$subpublic_score", "$professional_score"],
          },
        }, // 再添加一个score字段，值为原有三个字段相加之和
      },
      /*
         //{
         //    _id: 2,
         //    student: "Ryan",
         //    quiz: [ 8, 8 ],
         //}
    {
      $addFields: {
        totalQuiz: { $sum: "$quiz" } // 添加totalQuiz字段，值为quize数组字段的和
      }
    },
   */
      {
        $project: {
          _id: 0,
          paper_id: 1,
          //public_score:1,
          //subpublic_score:1,
          //professional_score:1,
          score: 1,
          begin_time: 1,
          submit_time: 1,
          "data.paper_name": 1,
          "data.paper_batch": 1,
          "data.paper_term": 1,
          "data.duration": 1,
          "data.start_time": 1,
          "data.end_time": 1,
        },
      },
    ]);
    /* the function of the loop for is same as the array.map
    let papers = [];
    for (let i = 0; i < result.length; i++) {
      let item = {
        paper_id: result[i].paper_id,
        ...result[i].data[0],
        score: result[i].score,
        submit_time:result[i].submit_time,
        begin_time:result[i].begin_time
      };
      papers.push(item);
    }
    */
    let papers = result.map((item) => {
      return {
        paper_id: item.paper_id,
        score: item.score,
        submit_time: item.submit_time,
        begin_time: item.begin_time,
        ...item.data[0],
      };
    });
    /*
    result = result.map(item=>{
    item.score = item.public_score+item.subpublic_score+item.professional_score;
    delete item.public_score
    delete item.subpublic_score
    delete item.professional_score
    return item
  });
  */
    res.status(200).json({
      status: "success",
      data: {
        papers,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.getPaperByPid = async (req, res) => {
  try {
    const data = await Userpaper.findOne({
      paper_id: req.params.paper_id,
    });
    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.getPaperByUidPid = async (req, res) => {
  try {
    const data = await Userpaper.findOne({
      user_id: req.query.user_id,
      paper_id: req.query.paper_id,
    });
    //--call function getQuesByQid to get the questions from 3 question bank seperatelly
    let pqs = data.public_questions; //the array pqs contains all the question ids from the public question bank.
    pqs = await getQuesByQid(pqs, PublicQues);
    let spqs = data.subpublic_questions; //the array spqs contains all the question ids from the sub public question bank.
    spqs = await getQuesByQid(spqs, SubPublicQues);
    let proqs = data.professional_questions; //the array proqs contains all the question ids from the professional question bank.
    proqs = await getQuesByQid(proqs, ProfessionalQues);
    //--
    res.status(200).json({
      status: "success",
      public_questions: {
        pqs,
      },
      sub_public_questions: {
        spqs,
      },
      professional_questions: {
        proqs,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.getPublicSectionByUidPid = async (req, res) => {
  try {
    const data = await Userpaper.findOne({
      user_id: req.query.user_id,
      paper_id: req.query.paper_id,
    });
    //--call function getQuesByQid to get the questions from 3 question bank seperatelly
    let qs = data.public_questions; //the array qs contains all the question ids from the public question bank.
    qs = await getQuesByQid(qs, PublicQues);
    //--
    res.status(200).json({
      status: "success",
      questions: {
        qs,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.getSubPublicSectionByUidPid = async (req, res) => {
  try {
    const data = await Userpaper.findOne({
      user_id: req.query.user_id,
      paper_id: req.query.paper_id,
    });
    let qs = data.subpublic_questions; //the array qs contains all the question ids from the sub public question bank.
    qs = await getQuesByQid(qs, SubPublicQues);

    res.status(200).json({
      status: "success",
      questions: {
        qs,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.getProfessionSectionByUidPid = async (req, res) => {
  try {
    const data = await Userpaper.findOne({
      user_id: req.query.user_id,
      paper_id: req.query.paper_id,
    });

    let qs = data.professional_questions; //the array proqs contains all the question ids from the professional question bank.
    proqs = await getQuesByQid(qs, ProfessionalQues);

    res.status(200).json({
      status: "success",
      questions: {
        qs,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
async function getQuesByQid(qs, whichquestionBank) {
  try {
    let result = [];
    for (let i = 0; i < qs.length; i++) {
      let statement = await whichquestionBank.find(
        { _id: qs[i].ques_id },
        "statement attachment"
      );
      let item = {
        ques_id: qs[i].ques_id,
        ...statement[0].statement,
        user_answer: qs[i].user_answer,
        attachment: statement[0].attachment,
      };
      result.push(item);
    }
    return result;
  } catch (err) {
    console.log(err);
  }
}
exports.getAllPapers = async (req, res) => {
  const data = await Userpaper.find();

  res.status(200).json({
    status: "success",
    results: branches.length,
    data: {
      data,
    },
  });
};
exports.deleteOnePaper = async (req, res) => {
  try {
    const data = await Userpaper.findOneAndDelete({
      user_id: req.params.user_id,
      paper_id: req.params.paper_id,
    });

    if (data != null) {
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

exports.calculateByUidPid = async (req, res) => {
  try {
    let data = await Userpaper.findOne({
      user_id: req.body.user_id,
      paper_id: req.body.paper_id,
    });
    let score = 0;//the score of one question bank
    let section = req.body.section;//the value of section is 1 or 2 or 3. 
                                   //1 means the question which will update is from public_questions field
                                   //2 means the question which will update is from subpublic_questions field
                                   //3 means the question which will update is from professional_questions field
    
    let qs = data.public_questions; 
    let whichquestionBank = PublicQues;
    if(section===2){
       qs = data.subpublic_questions;
       whichquestionBank = SubPublicQues;
    }
    else if(section===3){
       qs = data.professional_questions;
       whichquestionBank = ProfessionalQues;
    }
    for(let i = 0; i < qs.length ; i++ ){
      let info = await whichquestionBank.findOne({ _id: qs[i].ques_id },"statement");
      let right_answer = info.statement.right_answer;
      if(qs[i].user_answer === right_answer){
          score = score + 2;
      };
    }      
   
    //-----update the user_answer--------
    
    if(section===2)
       data.subpublic_score = score;
    else if(section===3)
       data.professional_score = score;
    else data.public_score = score;

    data.save();
    res.status(200).json({status: "calculate success"});
  } catch (err) {console.log(err);
    res.status(404).json({ status: "fail", message: err });
    
  }
};
exports.updateOneByUidPid = async (req, res) => { 
  try {
    const data = await Userpaper.findOne({
      user_id: req.body.user_id,
      paper_id: req.body.paper_id,
    });
    let section = req.body.section;//the value of section is 1 or 2 or 3. 
                                   //1 means the question which will update is from public_questions field
                                   //2 means the question which will update is from subpublic_questions field
                                   //3 means the question which will update is from professional_questions field
    let qs = data.public_questions; 
    if(section===2)
       qs = data.subpublic_questions;
    else if(section===3)
       qs = data.professional_questions;
    //update the score for 3 question bank seperatelly
    for(let i = 0; i < qs.length ; i++ ){
      if( qs[i].ques_id === req.body.ques_id ){
         qs[i].user_answer = req.body.user_answer;
         break;
      }      
    }
    //-----update the user_answer--------
    
    if(section===2)
       data.subpublic_questions = qs;
    else if(section===3)
       data.professional_questions = qs;
    else data.public_questions = qs;

    data.save();
    res.status(200).json({status: "update success"});
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
}