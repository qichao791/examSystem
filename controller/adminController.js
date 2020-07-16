const User = require("../model/userModel")
const PublicQues = require("../model/questionbankModel");
const SubQues = require("../model/subpublicbankModel");
const ProfQues = require("../model/professionalbankModel");

/**
 * 单个添加题目
 * 根据参数bank_type，向对应题库添加
 */
exports.addQuestion = async (req, res) => {
    console.log("req:", req)
    var ques = req.body
    var bank_type = req.params.bank_type
    var ques_model = await getQuesModel(bank_type)
    try {
        await ques_model.create(ques, function (err) {
            if (err) {
                console.log(err)
                res.status(200).json({
                    status: "false"
                })
            } else {
                res.status(200).json({
                    status: "true"
                })
            }
        })
    } catch (err) {
        console.log(err)
    }
}

exports.modifyQuestion = async (req, res) => {
    var ques_id = req.query.ques_id
    var bank_type = req.query.bank_type
    var newques = req.body

    var ques_model = await getQuesModel(bank_type)
    try {
        await ques_model.findByIdAndUpdate({ _id: ques_id }, newques, function (err) {
            if (err) {
                console.log(err)
                res.status(200).json({
                    status: false
                })
            } else {
                console.log("modify success")
                res.status(200).json({
                    status: true
                })
            }
        });
    } catch (err) {
        console.log(err)
        res.status(200).json({
            status: "false",
        })
    }
}

exports.upLoadFile = async (req, res) => {
    var type = req.body.type
    if (type == "avatar") {//上传用户头像
        var user_id = req.body.user_id
        var avatarPath = "/avatar/" + req.file.filename
        try {
            await User.findByIdAndUpdate({ _id: user_id }, { $set: { avatar: avatarPath } }, (err) => {
                if (err) {
                    console.log(err)
                    res.status(200).json({
                        status: false
                    })
                } else {
                    console.log("upLoad Avatar Success")
                    res.status(200).json({
                        status: true
                    })
                }
            })
        } catch (err) {
            console.log(err)
            res.status(200).json({
                status: false
            })
        }
    } else {//type：attachment 上传的是题目附件
        var ques_bank = req.body.ques_bank
        var ques_id = req.body.ques_id
        var fileType = req.body.file_type
        var attachmentPath

        if (req.file.mimetype.startsWith("image")) {//图像
            attachmentPath = "/attachment/image/" + req.file.filename   //拼接图像存储路径
        } else if (req.file.mimetype.startsWith("video")) {//视频
            attachmentPath = "/attachment/video/" + req.file.filename
        } else if (req.file.mimetype.startsWith("audio")) {//音频
            attachmentPath = "/attachment/voice/" + req.file.filename
        }

        var ques_model = await getQuesModel(ques_bank);
        var result = await upLoadAttachment(ques_model, ques_id, fileType, attachmentPath)
        if (result == true) {
            res.status(200).json({
                status: true
            })
        } else {
            res.status(200).json({
                status: false
            })
        }

    }
}

/**
 * 上传题目附件
 * @param {题库的model} ques_model 
 * @param {题目Id} ques_id 
 * @param {附件类型} fileType 
 */
async function upLoadAttachment(ques_model, ques_id, fileType, attachmentPath) {
    var image = []
    var video = []
    var voice = []
    switch (fileType) {
        case 'image': {
            image.push(attachmentPath)
        } break;
        case 'video': {
            video.push(attachmentPath)
        } break;
        case 'audio': {
            voice.push(attachmentPath)
        } break;
    }
    try {
        var question
        switch (fileType) {
            case 'image': {
                question = await ques_model.findById({ _id: ques_id })
                question.attachment.image = image
                question.save()
                return true
            };
            case 'video': {
                question = await ques_model.findById({ _id: ques_id })
                question.attachment.video = video
                question.save()
                return true

            };
            case 'audio': {
                question = await ques_model.findById({ _id: ques_id })
                question.attachment.voice = voice
                question.save()
                return true
            };
            default:
                return false
        }

    } catch (err) {
        console.log(err)
        return false
    }
}

/**
 * 根据题库名称匹配对应的model
 * @param {题库名} ques_bank 
 */
async function getQuesModel(ques_bank) {
    var ques_model
    switch (ques_bank) {
        case 'questionbank': {
            ques_model = PublicQues
        } break;
        case 'professionalbank': {
            ques_model = ProfQues
        } break;
        case 'subpublicbank': {
            ques_model = SubQues
        } break;
    }
    return ques_model;

}