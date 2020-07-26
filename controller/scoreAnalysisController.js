const Userpaper = require("../model/userpaperModel")
const User = require("../model/userModel")


/**
 * 某branch在某次考试成绩分析
 */
exports.oneExamAnalysis = async (req, res) => {
    //console.log("req:",req)
    var paper_id = req.query.paper_id
    var branch_id = req.query.branch_id

    var branch_users = await User.find({ branch_id: branch_id }, '_id')//getAllUserOfOneBranch
    // console.log("branch_users:", branch_users)
    // let branch_users_paperscore = await Userpaper.find({paper_id:paper_id,user_id:{$in:branch_users}})//根据paper_id 获取本次考试中上述branch中人员的成绩
    // var totalUserNum = branch_users_paperscore.length
    // var tatalScore = 0
    // var avage
    // for(var i=0;i<totalUserNum;i++){
    //     tatalScore+=branch_users_paperscore[i].public_score;
    //     tatalScore+=branch_users_paperscore[i].subpublic_score;
    //     tatalScore+=branch_users_paperscore[i].professional_score;
    // }
    // console.log("branch_users_paperscore",branch_users_paperscore)

    let branch_users_paperscore = await Userpaper.aggregate([
        {
            $lookup: {
                from: 'user',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user_userpaper'
            }
        },
        {
            $match: { $and: [{ paper_id: paper_id }, { 'user_userpaper.branch_id': branch_id }] }
        }
    ])
    console.log("结果数量：", branch_users_paperscore.length)
    var totalPeopleNum = branch_users_paperscore.length //该branch考试总人数
    var totalScore = 0  //该branch本次考试总成绩
    var averageScore = 0    //该branch本次考试平均分
    var numInScoreSegment = [0, 0, 0, 0, 0]   //<60,60~69,70~79,80~89,90~100 四个分数段
    var passRate = 0    //该branch本次考试及格率
    var peoplesName = []    //该branch的员工名称
    var peoplesScore = []   //每个员工的分数，根据数组下标对应peoplesName中的姓名
    for (var i = 0; i < branch_users_paperscore.length; i++) {
        var score = branch_users_paperscore[i].public_score + branch_users_paperscore[i].subpublic_score + branch_users_paperscore[i].professional_score
        totalScore+=score
        peoplesName.push(branch_users_paperscore[i].user_userpaper[0].user_name)
        peoplesScore.push(score)
        score=parseInt(score/10)
        // switch (score) {
        //     default: console.log("score:",score);
        //     case score < 60: {numInScoreSegment[0]++; console.log("分数在小于60") ;break}
        //     case score >= 60 && score < 70: numInScoreSegment[1]++; break
        //     case score >= 70 && score < 80: numInScoreSegment[2]++; break
        //     case score >= 80 && score < 90: numInScoreSegment[3]++; console.log("分数在80-89") ; break
        //     case score >= 90 && score <= 100: numInScoreSegment[4]++; break
        // }

        switch (score) {
            default: console.log("score:",score);
            case 0,1,2,3,4,5: numInScoreSegment[0]++;break
            case 6: numInScoreSegment[1]++; break
            case 7: numInScoreSegment[2]++; break
            case 8: numInScoreSegment[3]++; console.log("分数在80-89") ; break
            case 9,10: numInScoreSegment[4]++; break
        }
        
    }
    averageScore = totalScore/totalPeopleNum;
    passRate = 1-numInScoreSegment[1]/totalPeopleNum;
    // console.log("numInScoreSegment",numInScoreSegment)
    res.send({
        averageScore:averageScore,
        passRate:passRate,
        numInScoreSegment:numInScoreSegment,
        peoplesName:peoplesName,
        peoplesScore:peoplesScore
    })

}

