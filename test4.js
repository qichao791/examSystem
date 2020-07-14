const mongoose = require("mongoose");
const PublicQues = require("./model/questionbankModel");
const Userpaper = require("./model/userpaperModel");
const SubPublicQues = require("./model/subpublicbankModel");
const ProfessionalQues = require("./model/professionalbankModel");

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
async function abc() {
    try {
        let result = await PublicQues.aggregate([
            { $match: { grade: 1 } },
            { $sample: { size: 2 } },
            { $project: { _id: 1 } }
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
        res.status(404).json({ status: "fail", message: err });
    }
}

async function sss() {
    let up = new Userpaper();
    up.user_id = 'u001';//req.params.user_id;
    up.paper_id = 'papr001';//req.params.paper_id;
    let publicQuestions = await abc();
    up.public_questions = publicQuestions.map(item => {
        return {
            ques_id: item, user_answer: 'Z'
        }
    });
    up.save();
}

sss();
//

*/
var ques = new ProfessionalQues ();
var ques1 = new ProfessionalQues ();
ques.depart_id="b0934750-c419-11ea-914a-1db0dc6b92e0";
ques.branch_id="60471550-c415-11ea-a0b5-d380a00b1ea3";
ques.statement = {
  stem: "1.专业题 ： 坎坎坷坷坎坎坷坷坎坎坷坷看看",
  options: ["aaaaa",  "bbbbb" , "ccccc" , "ddddd" ],
  right_answer:"B",}
ques.attachment={
    image: [
        "https://wiki.wannax.cn/stastic/000000.jpg",
        "https://wiki.wannax.cn/stastic/11111.jpg",
    ],
    voice: [
        "https://wiki.wannax.cn/weixin/music/liang.mp3"
    ],
    video: [
        "https://wiki.wannax.cn/weixin/videos/trailer.mp4"
    ]
  };
ques.analysis = "analysisanalysisanalysisanalysisanalysis";
ques.grade = 2;
//ques.save();
ques1.statement = {
    stem: "1.1.专业题 ： 哦哦哦 i 哦 i 哦 i 哦看.",
  options: ["aaaaa",  "bbbbb" , "ccccc" , "ddddd" ,"eeeee"],
  right_answer:"CE",}
  ques1.attachment={
    image: [
        "https://wiki.wannax.cn/stastic/000000.jpg",
        "https://wiki.wannax.cn/stastic/11111.jpg",
    ],
    voice: [
        "https://wiki.wannax.cn/weixin/music/liang.mp3"
    ],
    video: [
        "https://wiki.wannax.cn/weixin/videos/trailer.mp4"
    ]
  };
ques1.depart_id="b0934750-c419-11ea-914a-1db0dc6b92e0";
ques1.branch_id="60471550-c415-11ea-a0b5-d380a00b1ea3";
ques1.analysis = "analysisanalysisanalysisanalysisanalysis";
ques1.grade = 2;
ques1.save().then(() => ques.save());
