const mongoose = require("mongoose");
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
  .then(() => {
    console.log("DB connection successful!");
  });
//PASSWORD=SNNU_pro_3418!

const User = require("./model/userModel");

// var user = new User({
//   _id: "410725199705202810",
//   user_name: "彭卫杰",
//   depart_id: "b0934750-c419-11ea-914a-1db0dc6b92e0",
//   branch_id: "60471550-c415-11ea-a0b5-d380a00b1ea3",
//   photo: "/avatar/default.png",
//   password: "111111"
// })

// user.save()

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
async function test() {
  var user1 = await getUserById("410725199705202810");

  console.log("得到的User是：", user1)
  var userinfos = await getUserInfo(user1)
}
test();





