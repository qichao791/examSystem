const mongoose = require("mongoose");
const PublicQues = require("./model/questionbankModel");
const Userpaper = require("./model/userpaperModel");

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
var ques = new PublicQues();
var ques1 = new PublicQues();
ques.statement = {
  stem: "1.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.",
  options: ["aaaaa",  "bbbbb" , "ccccc" , "ddddd" ],
  right_answer:"B"
};
ques.analysis = "analysisanalysisanalysisanalysisanalysis";
ques.grade = 2;
//ques.save();
ques1.statement = {
    stem: "1.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.",
  options: ["aaaaa",  "bbbbb" , "ccccc" , "ddddd" ,"eeeee"],
  right_answer:"CE"
};
ques1.analysis = "analysisanalysisanalysisanalysisanalysis";
ques1.grade = 2;
ques1.save().then(() => ques.save());
