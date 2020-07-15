const mongoose = require("mongoose");
const User = require("./model/userModel");


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
                    username: 1,
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
getOneDepartUsers("b0934750-c419-11ea-914a-1db0dc6b92e1")   ;