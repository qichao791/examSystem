const mongoose = require("mongoose");
// name, departId, branchId, photo, password

const userSchema = new mongoose.Schema({
  _id:{
    type:String,
    required: [true, 'Please tell us user ID'],
    length: 18,

  },
  user_name: {
    type: String,
    required: [true, "Please tell us user's name"],
  },
  depart_id: {
    type: mongoose.Schema.Types.String,
    ref: 'Depart',
  },
  branch_id:{
    type: mongoose.Schema.Types.String,
    ref: 'Branch',
  },
  photo: { 
      type: String, 
      default: '/avatar/default.png'
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    default:'111111',
    length: 6,
    select: false,
  },
},{_id:false});


const User = mongoose.model("User", userSchema,'user');
module.exports = User;
