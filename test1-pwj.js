const mongoose = require("mongoose");
mongoose
  .connect("mongodb://root@192.168.188.104:27017/exam_system_db", {
    user: "root",
    pass: "123456",
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("DB connection successful!");
  });
//PASSWORD=SNNU_pro_3418!

// const User = require("./model/userModel");
const Userpaper = require("./model/userpaperModel");
const User = require("./model/userModel");
const Paper = require("./model/paperModel");
const Depart = require("./model/departModel")
const Branch = require("./model/branchModel")


async function test() {
  var paper_batch = "10月第1次";
  var paper_term = "2020";
  var paper_name = "职业卫生专项培训考试";
  var paper_id="14830d20-0a26-11eb-9823-5779bcbdc091";
  var exam_month =
    paper_batch.length == 5
      ? paper_batch.substr(0, 1)
      : paper_batch.substr(0, 2);

  try {
    var examList = await Paper.find({
      paper_name: paper_name,
      paper_term: paper_term
    });
    var examListThisMonth = []; //某年份、某种名称、某个月份的所有考试
    var examCount;
   // console.log("examList:",examList)
    for (examCount = 0; examCount < examList.length; examCount++) {
      var batch_month =
        examList[examCount].paper_batch.length == 5
          ? examList[examCount].paper_batch.substr(0, 1)
          : examList[examCount].paper_batch.substr(0, 2);
      if (batch_month == exam_month) {
        examListThisMonth.push(examList[examCount]);
      }
    }
    console.log("examListThisMonth:", examListThisMonth);
    var usersId = await Userpaper.find({ paper_id: paper_id }, "user_id");
    console.log("usersId:",usersId)
    scoreList=[];
    var user_score=[];
    
    for(var i=0;i<usersId.length;i++){
        var user=await User.findById(usersId[i].user_id);
        console.log("user:",user)
        var depart= await Depart.findById(user.depart_id)
        var branch=await Branch.findById(user.branch_id)
        var user_name=user.user_name
        var depart_name=depart.depart_name
        var branch_name=branch.branch_name
        var score=[]
        for(var j=0;j<examListThisMonth.length;j++){
          var user_paper=await Userpaper.findOne({paper_id:examListThisMonth[j]._id,user_id:user._id})
          if(user_paper==null) {score[j]=null}else{
            score[j]=user_paper.public_score+user_paper.subpublic_score+user_paper.professional_score
          }
          //console.log("user_paper",i,j,":",user_paper)
          
        }
        var user_month_score={user_name,depart_name,branch_name,score}      
        user_score.push(user_month_score)
    }
    console.log("user_score:",user_score)



  } catch (err) {
 
    console.log("获取信息失败,", err);
  }
}
test()
// var admin=new Admin({
//   _id:"123456",
//   password:"111111"

// })
// admin.save()

// var user = new User({
//   _id: "41072519970520281x",
//   user_name: "王六",
//   depart_id: "b0934750-c419-11ea-914a-1db0dc6b92e0",
//   branch_id: "60471550-c415-11ea-a0b5-d380a00b1ea3",
//   photo: "/avatar/default.png",
//   password: "111111"
// })

// user.save()
/*
async function getUserById(user_id) {
  try {
    //console.log("req.body",req.body)
    let user = await User.findOne({
      _id: user_id
    })
    console.log("user是", user)
    return user;
  } catch (err) {
    console.log(err)
  }
}
async function getUserInfo(user) {
  try {
    console.log("user_id:",user._id)
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
        $match: {
          _id: user._id
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
        $project: {
          _id: 0,
          user_name: 1,
          photo: 1,
          'user_department.depart_name': 1,
          'user_branch.branch_name': 1,
        }
      }
    ]);
    console.log("userinfo:", userinfo)
    return userinfo
  } catch (err) {
    console.log(err)
  }
}
*/
// async function getOneDepartUsers(depart_id) {  //获取用户及其部门、branch名称
//   try {
//     let userinfo = await User.aggregate([
//       {
//         $lookup: {
//           from: 'department',
//           localField: 'depart_id',
//           foreignField: '_id',
//           as: 'user_department'
//         }
//       },
//       {
//         $lookup: {
//           from: 'branch',
//           localField: 'branch_id',
//           foreignField: '_id',
//           as: 'user_branch'
//         }
//       },
//       {
//         $match: {
//           depart_id: depart_id
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           user_name: 1,
//           user_department: 1,
//           user_branch: 1,
//         }
//       }
//     ]);
//     console.log("userinfo:", userinfo)
//     return userinfo
//   } catch (err) {
//     console.log(err)
//   }
// }
// async function test() {
//   //var user1 = await getUserById("410725199705202810");
//   var departUsers = await getOneDepartUsers('b0934750-c419-11ea-914a-1db0dc6b92e0')
//   console.log("部门员工：", departUsers)
//   var users = []
//   for (var i = 0; i < departUsers.length; i++) {
//     var user ={
//       user_id:departUsers[i]._id,
//       username:departUsers[i].user_name,
//       depart_name:departUsers[i].user_department[0].depart_name,
//       branch_name:(departUsers[i].user_branch.length==0)?'':departUsers[i].user_branch[0].branch_name
//     }
//     users.push(user)
//   }
//   console.log("users:",users)
// }
// test();

// var query = User.deleteOne({ _id: '41072519970520281x' }, function (err) {
//   if (err) {
//     console.log(err)

//   } else {
//     console.log("OK")
//   }
// })
// console.log(query)

// async function getAverageScoreByPapersid(papers_id) {
//   var papersAvgScore = await Userpaper.aggregate([
//     {
//       $match: { paper_id: papers_id }
//     },
//     {
//       $lookup: {
//         from: 'paper',
//         localField: 'paper_id',
//         foreignField: '_id',
//         as: 'userpaper_paper'
//       }
//     },
//     {
//       $group: {
//         _id: "$paper_id",
//         name: { $first: "$userpaper_paper.paper_name" },
//         "avg_public_score": {
//           $avg: "$public_score"
//         },
//         "avg_subpublic_score": {
//           $avg: "$subpublic_score"
//         },
//         "avg_professional_score": {
//           $avg: "$professional_score"
//         }
//       }
//     },
//     {
//       $project: {
//         paper_id: 1,
//         name: 1,
//         avg_public_score: 1,
//         avg_subpublic_score: 1,
//         avg_professional_score: 1,
//         average_score: { $sum: ['$avg_public_score', '$avg_subpublic_score', '$avg_professional_score'] }
//       }
//     }
//   ])
//   console.log("papersAvgScore:", JSON.stringify(papersAvgScore))
// }

// var p = 'fb12a300-c33f-11ea-bc6f-e1ad3a6cdc52'
// getAverageScoreByPapersid(p)
