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
const PublicQues = require("./model/professionalbankModel");
var ques = new PublicQues();
var ques1 = new PublicQues();
ques.depart_id='d001';
ques.branch_id='b002';
ques.statement = {
  stem: "1.人人人人人人人人人人人人人人人人人人人即可.",
  options: [
    { option_name: "A.", option_value: "aaaaa", is_answer: true },
    { option_name: "B.", option_value: "bbbbb" },
    { option_name: "C.", option_value: "ccccc" },
    { option_name: "D.", option_value: "ddddd" },
  ],
};
ques.analysis = "analysisanalysisanalysisanalysisanalysis";
ques.grade = 2;
//ques.save();
ques1.statement = {
  stem: "1.呜呜呜呜呜呜呜呜呜呜呜呜呜呜呜呜呜呜.",
  options: [
    { option_name: "A.", option_value: "aaaaa", is_answer: true },
    { option_name: "B.", option_value: "bbbbb" },
    { option_name: "C.", option_value: "ccccc" },
    { option_name: "D.", option_value: "ddddd" },
  ],
};
ques1.analysis = "analysisanalysisanalysisanalysisanalysis";
ques1.grade = 2;
ques1.depart_id='d001';
ques1.branch_id='b002';
ques1.save().then(() => ques.save());
