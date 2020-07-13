const User = require("../model/userModel");

const mongoose = require("mongoose");

exports.getAllUsers = async (req, res) => {
    console.log("getALL ")
    //let filter = {};
    //if (req.params.courseId)
    //  filter = { buyCourses: { $elemMatch: { course: req.params.courseId } } };
    //console.log(filter);
    const users = await User.find();

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
};
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        //course.findOne({_id:req.params.id});

        res.status(200).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(404).json({ status: "fail", message: err });
    }
};
exports.createUser = async (req, res) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            selected,
        },
    });
};
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
        });
        res.status(200).json({
            status: "success",
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(404).json({ status: "fail", message: err });
    }
};
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "This route is not defined!",
    });
};
exports.userLogin = async (req, res) => {
    var user_id = req.body._id
    var password = req.body.password

    var user = (await User.findById(user_id));
    if (user == null) {
        res.status(200).json({
            status: "false",
            message: "用户不存在"
        })
    } else {
        if (user.password != password) {
            res.status(200).json({
                status: "false",
                message: "密码错误"
            })
        } else {
            var userinfo = await getUserInfo(user)
            var usermsg = { photo: userinfo[0].photo, user_name: userinfo[0].user_name, depart_name: userinfo[0].user_department[0].depart_name, branch_name: userinfo[0].user_branch[0].branch_name }
            res.status(200).json({
                status: "true",
                message: usermsg
            })
        }
    }
}

async function getUserInfo(user) {  //获取用户及其部门、branch名称
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
                    _id: user._id
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