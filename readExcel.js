const PublicQues = require("./model/questionbankModel");
const mongoose = require("mongoose");
const uuid = require("uuid");
/*const DB = "mongodb://127.0.0.1:27017/exam_system_db";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successful!");
  });
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
    .then(() => console.log("DB connection successful!"));*/
async function importQuessToPublicBank (){ 
      var xl = require('xlsx');
      var fs = require('fs');
      //var xlsxFileName = req.body.fileName;
      var workbook = xl.readFile("1.xlsx")
      const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
    
      // 根据表名获取对应某张表
    
      const worksheet = workbook.Sheets[sheetNames[0]];
      var dataa =xl.utils.sheet_to_json(worksheet);
    
      try {
        //for(let i=0;i<dataa.length;i++){
          /*let ques = new PublicQues();
            ques.statement = {
               stem: dataa[i].stem,
               options: dataa[i].options.split('$'),
               right_answer:dataa[i].right_answer,
            };
            ques.analysis = dataa[i].analysis;
            ques.knowlege = dataa[i].knowlege;
            ques.grade = dataa[i].grade;
            ques.attachment = {
               image:dataa[i].images.split('$'),
               voice:dataa[i].voices.split('$'),
               video:dataa[i].videos.split('$'),
            }
            //await ques.save()
            */
           let i=1;
            let options=[dataa[i].A,]
           
            if(dataa[i].B)
              options.push(dataa[i].B)
            if(dataa[i].C)
              options.push(dataa[i].C)
            if(dataa[i].D)
              options.push(dataa[i].D)
            if(dataa[i].E)
              options.push(dataa[i].E)
            console.log(options)
        //}
    
        //console.log(quess)
        } catch (err) {
          console.log(err)
        }
    }
    importQuessToPublicBank ()