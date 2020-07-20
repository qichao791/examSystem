const mongoose = require("mongoose");
const User = require("./model/userModel");
/*

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
async function getOneDepartUsers(depart_id) {  //获取用户及其部门、branch名称
    try {
        let userinfo = await User.aggregate([
            {
                $lookup: {
                    from: 'department',
                    localField: 'depart_id',
                    foreignField: '_id',
                    as: 'user_department'
                }
            },
            {
                $lookup: {
                    from: 'branch',
                    localField: 'branch_id',
                    foreignField: '_id',
                    as: 'user_branch'
                }
            },
            {
                $match: {
                    depart_id: depart_id
                }
            },
            {
                $project: {
                    _id: 1,
                    user_name: 1,
                    'user_department.depart_name': 1,
                    'user_branch.branch_name': 1,
                }
            }
        ]);
        console.log("userinfo:", JSON.stringify(userinfo));
        return userinfo
    } catch (err) {
        console.log(err)
    }
}
//getOneDepartUsers("b0934750-c419-11ea-914a-1db0dc6b92e1")   ;
async function abc() {  //获取用户及其部门、branch名称
  try{
    let user = await User.aggregate( [
      {
        $group: {
                  _id: {depart:'$depart_id',branch:'$branch_id'},
                  //count: { $sum: 1 }
                  userName: {$push: '$user_name'}
                }
                
      },
    //   {
    //     $project: {
    //         _id: 1,
    //         user_name: 1,
    //         depart_id:1,
    //         //'user_department.depart_name': 1,
    //         //'user_branch.branch_name': 1,
    //     }
    // }
   ] );
   console.log("userinfo:", JSON.stringify(user));
  }catch(err) {
    console.log(err)}
}
abc();
*/
    function dd(){
       // var files = e.target.files;
        var fileReader = new FileReader();
        fileReader.onload = function(ev) {
            try {
                var data = ev.target.result
                var workbook = XLSX.read(data, {
                    type: 'binary'
                }) // 以二进制流方式读取得到整份excel表格对象
                var persons = []; // 存储获取到的数据
            } catch (e) {
                console.log('文件类型不正确');
                return;
            }
            // 表格的表格范围，可用于判断表头是否数量是否正确
            var fromTo = '';
            // 遍历每张表读取
            for (var sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    console.log(fromTo);
                    persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }
            //在控制台打印出来表格中的数据
            console.log(persons);
        }
    }
dd();