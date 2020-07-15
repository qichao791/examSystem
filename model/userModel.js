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
  avatar: { 
      type: String, 
      default: '/avatar/default.png'
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    default:'111111',
    length: 6
  },
  active:{
    type:Boolean
  }
},{_id:false});

/*
userSchema.pre("save", async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  //False means NOT changed
  return false;
};

*/
const User = mongoose.model("User", userSchema,'user');
module.exports = User;
