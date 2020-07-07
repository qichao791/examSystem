const Branch= require("../model/branchModel");
const mongoose = require("mongoose");

exports.getBranch = async (req, res) => {
    try {
      const branch = await Branch.findOne({ _id:req.params.branch_id });
      //.findById(req.params.branch_id);
      res.status(200).json({
        status: "success",
        data: {
          branch,
        },
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};

exports.getAllBranches = async (req, res) => {
    const branches = await Branch.find();
  
    res.status(200).json({
      status: "success",
      results: branches.length,
      data: {
        branches,
      },
    });
};
exports.createBranch = async (req, res) => {
    try{
        const newBranch = await Branch.create(req.body);
        res.send(newBranch);
      
    }catch (err) {
        console.log(err);
    }
};
exports.deleteBranch = async (req, res) => {
    try {
      const readyToDeleteBranch = await Branch.findOneAndDelete({_id:req.params.branch_id});
      
      if (readyToDeleteBranch!= null) {
        res.status(204).json({
          status: "success",
          data: null,
        });
      } else {
        res.status(404).json({ status: "fail", message: "not found" });
      }
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
};
exports.updateBranch = async (req, res) => {
    try {
      const readyToUpdateBranch = await Branch.findOneAndUpdate({_id:req.params.branch_id},req.body,{
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        status: "success",
        data: {
            readyToUpdateBranch,
        },
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err });
    }
}; 
exports.getDepartByBranch = async (req, res) => {
  Branch.aggregate([
    {
      $lookup: {
        from: 'department', //the colletion named department in the database qc of mongodb
        localField: '_id',  //the field of the collection branch which also is the model Branch in mongoose
        foreignField: 'branches', //the field of the collection department
        as: 'belongedToDepart',
      }
    },
    {
      $project: {
        _id:0,
        branch_name: 1,
        'belongedToDepart._id': 1,
        'belongedToDepart.depart_name': 1
      }
    }
  ], (err, docs) => {
    if (err) {
      //console.log('查询错误', err);
      res.status(404).json({ status: "fail", message: err });
    }
    //console.log(JSON.stringify(docs));
    res.status(200).json({
      status: "success",
      data: {
          docs,
      },
    });
  })
}
/* 根据发送的请求 进行相关的操作
app.get("/",async(req,res)=>{
    //cosnt data = await Product.find().limit(2).skip(1) // 分页 1页2条数据
    //const data = await Product.find().where({ title: "apple" }) // 查找title为apple的数据
    //const data = await Product.find().sort({ "_id": 1 }) // 1表示正序 -1表示倒叙
    const data = await Product.find() // 查找全部的数据
    res.send(data) // 发送给前端
  })
  // 根据 id 来进行查询数据
  app.get("/:id",async(req,res)=>{
      const data = await Product.findById(res.params.id)
      res.send(data)
  })
  // 新增数据post请求
  app.post("/add",async(req,res)=>{
      const data = req.body // 这边需要express开启才能得到在body里面 得到(就是中间件)
      const adddata = await Product.create(data)
      res.send(adddata)
  })
  // 根据 id 去修改数据展示
  app.post("/update/:id",async(req,res)=>{
      const pro= await Product.findById(req.params.id) // 先通过 id 找到相关的数据展示
      pro.title = req.body.title // 直接将发送过来的数据 进行保存
      await pro.save() // 一定要记得保存啊 
      res.send(pro)
  })
  // 根据id删除相关的数据
  app.post("/delete/:id",async(req,res)=>{
      const pro = await Product.findById(req.params.id)
      await pro.remove()
      res.send(pro)
  })
  */