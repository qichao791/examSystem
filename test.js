const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/qc');
const uuid = require("uuid");
const schema = new mongoose.Schema({ 
     _id:String,
     
     username:String,
     depart_id: {
       type: mongoose.Schema.Types.String,
       ref: 'Department',
     },
   }, 
   {
     _id:false
  });
const schema1 = new mongoose.Schema({
  _id:String,
  departname:String
  },
  {_id:false});

//let Person = mongoose.model('Person',schema,'person');
//let Department = mongoose.model('Department',schema1,'department');
const Person = mongoose.model('Person',schema);
const Department = mongoose.model('Department',schema1);
/*
let dept1=new Department({
    departname:'yyyy',_id:'d01'
});
dept1.save(function(err,target){
    if(err){
        console.error(err);
    }else{
        console.log(target);
    }
});
let dept2=new Department({
  departname:'xxxx',_id:'d02'
});
dept2.save(function(err,target){
  if(err){
      console.error(err);
  }else{
      console.log(target);
  }
});
let man1 = new Person({
    username:'qichao',
    _id:'p001',
    depart_id:'d01'
});
man1.save(function(err,target){
    if(err){
        console.error(err);
    }else{
        console.log(target);//{ __v: 0, name: 'noshower', _id: 1 }
    }
});
let man2 = new Person({
  username:'feiyang',
  _id:'p002',
  depart_id:'d01'
});
man2.save(function(err,target){
  if(err){
      console.error(err);
  }else{
      console.log(target);//{ __v: 0, name: 'noshower', _id: 1 }
  }
});
let man3 = new Person({
  username:'zhangxi',
  _id:'p003',
  depart_id:'d02'
});
man3.save(function(err,target){
  if(err){
      console.error(err);
  }else{
      console.log(target);//{ __v: 0, name: 'noshower', _id: 1 }
  }
});*/

        
            Person.aggregate([
              {
                $lookup: {
                  from: 'departments', // 关联到学生表
                  localField: 'depart_id', // 班级表中关联的字段
                  foreignField: '_id', // 学生表中被关联的id
                  as: 'stus',
                }
              }
            ], (err, docs) => {
              if (err) {
                console.log('查询错误', err);
                return
              }
              console.log(JSON.stringify(docs));
            })     
            /* 
            Department.aggregate([
              {
                $lookup: {
                  from: 'people', // 关联到学生表
                  localField: '_id', // 班级表中关联的字段
                  foreignField: 'depart_id', // 学生表中被关联的id
                  as: 'stus',
                }
              },{$project:{_id:0,departname:1,'stus.username':1}}//{$project:{_id:0,'stus._id':0,'stus.depart_id':0}}
            ], (err, docs) => {
              if (err) {
                console.log('查询错误', err);
                return
              }
              console.log(JSON.stringify(docs));
              return;
            })   */