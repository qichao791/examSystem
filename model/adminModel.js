const mongoose = require("mongoose");
// name, departId, branchId, photo, password

const adminSchema = new mongoose.Schema({
  _id:{
    type:String,
    required: [true, 'Please tell us user ID'],

  },
  password: {
    type: String,
    required: [true, "Please tell us user's password"],
  }
},{_id:false});

const Admin = mongoose.model("Admin", adminSchema,'admin');
module.exports = Admin;
