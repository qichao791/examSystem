const PublicQues = require("./model/questionbankModel");
const mongoose = require("mongoose");
const uuid = require("uuid");
/*const DB = "mongodb://127.0.0.1:27017/exam_system_db";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology:true
  })
  .then(() => {
    console.log("DB connection successful!");
  });
  const mySchema = new mongoose.Schema({
    _id:{
        type:String,
        // required: [true, "Please tell us ID"],
        // default:uuid.v1,
    },  
    //编号:String,
    //专业:String,
    //题目:String,
    statement: {
      stem:{
          type: String,
      },
      options: [  
          {
             type:String,
          },
      ],
  
  },
},{_id:false}); 

const mytest = mongoose.model("mytest", mySchema,'mytest');

async function abc(){
    var xl = require('xlsx');
    var fs = require('fs');

    var workbook = xl.readFile("1.xlsx")
    const sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']

    // 根据表名获取对应某张表

    const worksheet = workbook.Sheets[sheetNames[0]];

    var dataa =xl.utils.sheet_to_json(worksheet);

    let ques = new mytest();
    let quess=[]
    try {
      for(let i=0;i<dataa.length;i++){
        let ques = new mytest();
          //ques._id = i;
          ques.statement = {
          stem: dataa[i].题目,
          options: [dataa[i].编号,  dataa[i].专业 ],}
          console.log("题目",i,":",ques)
          await ques.save()
         
          //quess.push(ques)
      }
      
      //await mytest.create(quess)
      console.log(quess)
      } catch (err) {
        console.log(err)
      }
}
abc();
*/