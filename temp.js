const mongoose = require("mongoose");
const User = require("./model/userModel");
const PublicQues = require("./model/questionbankModel");
const SubQues= require("./model/subpublicbankModel");
const ProfQues= require("./model/professionalbankModel");
const Depart= require("./model/departModel");
const Branch = require("./model/branchModel");
const Userpaper = require("./model/userpaperModel");
const DB = "mongodb://127.0.0.1:27017/exam_system_db";
 /*
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successful!");
  });
 */
mongoose
    .connect("mongodb://root@192.168.1.104:27017/exam_system_db", {
        user: "root",
        pass: "123456",
        authSource: "admin",
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("DB connection successful!"));
/*
async function getOneDepartUsers(depart_id) {  //获取用户及其部门、branch名称
    try {
       

        let userinfo = await User.aggregate([
            {
                $lookup: {
                    from: 'department',
                    localField: 'depart_id',
                    foreignField: '_id',
                    as: 'user_department'
                }
            },
            {
                $lookup: {
                    from: 'branch',
                    localField: 'branch_id',
                    foreignField: '_id',
                    as: 'user_branch'
                }
            },
            {
                $match: {
                    depart_id: depart_id
                }
            },
            {
                $project: {
                    _id: 1,
                    user_name: 1,
                    'user_department.depart_name': 1,
                    'user_branch.branch_name': 1,
                }
            }
        ]);
        console.log("userinfo:", JSON.stringify(userinfo));
        return userinfo
    } catch (err) {
        console.log(err)
    }
}
//getOneDepartUsers("b0934750-c419-11ea-914a-1db0dc6b92e1")   ;
async function abc() {  //获取用户及其部门、branch名称
  try{
    let user = await User.aggregate( [
      {
        $group: {
                  _id: {depart:'$depart_id',branch:'$branch_id'},
                  //count: { $sum: 1 }
                  userName: {$push: '$user_name'}
                }
                
      },
    //   {
    //     $project: {
    //         _id: 1,
    //         user_name: 1,
    //         depart_id:1,
    //         //'user_department.depart_name': 1,
    //         //'user_branch.branch_name': 1,
    //     }
    // }
   ] );
   console.log("userinfo:", JSON.stringify(user));
  }catch(err) {
    console.log(err)}
}

Depart.findOne({ depart_name:"机修系统"},'_id',function(err,departID){
    if(err){}
    else
    console.log(departID);
});

async function ddd(){
    try {
        var xl = require('xlsx');
        var fs = require('fs');
        //var xlsxFileName = req.body.fileName;
        var workbook = xl.readFile("SubPublicquess.xlsx")
        const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
      
        // 根据表名获取对应某张表
      
        const worksheet = workbook.Sheets[sheetNames[0]];
        var data =xl.utils.sheet_to_json(worksheet);
        //let data = req.body.data;
        
    for(let i=0;i<data.length;i++){
      let ques = new SubQues();
      let departId = await Depart.findOne({ depart_name:data[i].depart_name},'_id');
      ques.depart_id = departId._id;
      //getDepartIDbyName(data[i].depart_name);
      ques.statement = {
           stem: data[i].stem,
           options: data[i].options.split('$'),
           right_answer:data[i].right_answer,
      }
      ques.analysis = data[i].analysis;
      ques.knowlege = data[i].knowlege;
      ques.grade = data[i].grade;
      ques.attachment = {
           image:data[i].images.split('$'),
           voice:data[i].voices.split('$'),
           video:data[i].videos.split('$'),
      }
      await ques.save();
          //await ques.save();
          console.log("######ques:"+ques)
          ///res.status(200).json({
             // status: "success",
         // });
        }
        } catch (err) {
          //res.status(404).json({ status: "fail", message: err });
          console.log(err)
        }
}
///////

async function xxx(req, res) {
  
    //var paper_id = req.query.paper_id
    //var branch_id = req.query.branch_id

    //var branch_users = await User.find({ branch_id: branch_id }, '_id')//getAllUserOfOneBranch
   

    let branch_users_paperscore = await Userpaper.aggregate([
        {
            $lookup: {
                from: 'user',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user_userpaper'
            }
        },
        {$match:{'user_userpaper.branch_id':"06c82430-c95e-11ea-aa1d-572970e14b87"}},
        {$match: { paper_id: "fb12a300-c33f-11ea-bc6f-e1ad3a6cdc52" }},
        {
            $project:{user_id:1,'user_userpaper.branch_id':1}
        }

    ])
    console.log("结果数量：",branch_users_paperscore.length)
    console.log(branch_users_paperscore)

}*/

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
      //console.log(depart[0].belongedToDepart[0]._id);
      return depart[0].belongedToDepart[0]._id
    }catch(err){
      return false;
    }
  
  }
  var depart=belongedToWhichDepart("06c82430-c95e-11ea-aa1d-572970e14b87")
  console.log(depart)
 // "19b5c450-d564-11ea-9b97-97731ce04117"