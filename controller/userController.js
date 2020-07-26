const User = require("../model/userModel");
const Userpaper = require("../model/userpaperModel")

const mongoose = require("mongoose");

/**
 * addUser
 * 插入一个或多个员工
 */
exports.addUser = async (req, res) => {
    var users = req.body
    try {
        var result = await User.insertMany(users)
        if (result.length == 0) {
            res.status(200).json({
                status:false,
            });
        } else {
            res.status(200).json({
                status: true,
            });
        }
    } catch (e) {
        console.log(e)
        res.status(200).json({
            status: false,
        });
    }
};

exports.getAllUsers = async (req, res) => {
    //console.log("getALL ")
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

/**
 * updateUser
 * 更新员工的信息
 */
exports.updateUser = async (req, res) => {
    //console.log("req.body:", req.body)
    try {
        const result = await User.replaceOne({ _id: req.body._id }, req.body);
        console.log("result", result)
        if (result.nModified == 1) {
            res.status(200).json({
                status: "true",
            })
        } else {
            res.status(200).json({
                status: "false",
            })
        }
    } catch (err) {
        console.log(err)
        res.status(200).json({
            status: "false",
        })
    }

};

/**
 * deleteUser
 *删除某个用户,先删userpaper中的数据，再删user中的数据
 */
exports.deleteUser = async (req, res) => {
    var user_id = req.body.user_id

    try {
        await Userpaper.deleteOne({ user_id: user_id })
        await User.deleteOne({ _id: user_id })
        res.status(200).json({
            status: "true"
        })
    } catch (err) {
        console.log(err)
        res.status(200).json({
            status: "false"
        })
    }
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
            if (user.active == false) {
                res.status(200).json({
                    status: "false",
                    message: "该用户未激活"
                })
            } else {
                var userinfo = await getUserInfo(user)
                var usermsg = {
                    avatar: userinfo[0].avatar,
                    user_name: userinfo[0].user_name,
                    branch_name: (userinfo[0].user_branch.length == 0) ? '' : userinfo[0].user_branch[0].branch_name,
                    depart_name: (userinfo[0].user_department.length == 0) ? '' : userinfo[0].user_department[0].depart_name
                }
                res.status(200).json({
                    status: "true",
                    message: usermsg
                })
            }

        }
    }
};

/**
 * getUsersByDepartId
 * 根据部门Id获取某该部门所有员工
 */
exports.getUsersByDepartId = async (req, res) => {
    var depart_id = req.query.depart_id
    var users = []
    try {
        var departUsers = await getUsersOfDepart(depart_id)
        console.log("部门员工：", departUsers)

        for (var i = 0; i < departUsers.length; i++) {
            var user = {
                user_id: departUsers[i]._id,
                user_name: departUsers[i].user_name,
                depart_name: departUsers[i].user_department[0].depart_name,
                branch_name: (departUsers[i].user_branch.length == 0) ? '' : departUsers[i].user_branch[0].branch_name,
                active: departUsers[i].active
            }
            users.push(user)
        }
        console.log("users:", users)
        res.status(200).json(
            users
        )
    } catch (err) {
        console.log(err)
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
                    avatar: 1,
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

async function getUsersOfDepart(depart_id) {
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
                    active: 1,
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
