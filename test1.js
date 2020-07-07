const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/qc');

const ClasssSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, '此项为必填内容'],
  },
  // 定义班级下面的学生，因为一个班级可以是多个学生,所以可以定义为数组
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'student',
    }
  ]
});
let ClasssModel = mongoose.model('ClasssModel', ClasssSchema, 'classs');
 

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, '此项为必填内容'],
  },
  age: Number,
});

let StudentModel = mongoose.model('StudentModel', StudentSchema, 'student');


/*多次添加学生
const student = new StudentModel({
  name: '马六',
  age: 35,
});
student.save();
const student1 = new StudentModel({
    name: 'John',
    age: 25,
  });
  student1.save();
// 添加班级
const cls = new ClasssModel({
  name: "初中一班",
  students: [
    "5f03e3c98c0fec81ad39715d", // id直接去数据库查看复制进去的
    "5f03e3c98c0fec81ad39715c"
  ]
});
cls.save();
*/

ClasssModel.aggregate([
    {
      $lookup: {
        from: 'student', // 关联到学生表
        localField: 'students', // 班级表中关联的字段
        foreignField: '_id', // 学生表中被关联的id
        as: 'stus',
      }
    },{$project:{_id:0,name:1,'stus.name':1}}
  ], (err, docs) => {
    if (err) {
      console.log('查询错误', err);
      return
    }
    console.log(JSON.stringify(docs));
  })

  
