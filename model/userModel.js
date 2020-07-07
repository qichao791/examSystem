const mongoose = require("mongoose");
// name, departId, branchId, photo, password

const userSchema = new mongoose.Schema({
  user_id:{
    type:String,
    required: [true, 'Please tell us user ID'],
    length: 18,
    unique:true,
  },
  user_name: {
    type: String,
    required: [true, "Please tell us user's name"],
  },
  depart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  branch_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  },
  photo: { 
      type: String, 
      default: "/avatar/default.png" 
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    default:'111111',
    length: 6,
    select: false,
  },
  /*
  papers: [
    {
      paper: {
        type: mongoose.Schema.ObjectId,
        ref: "Paper",
      },
      is_finished:{
        type:Boolean,
        default:false,
      },
      answer_1: [
        {
          question:{
              type: mongoose.Schema.ObjectId,
              ref:"Public_ques_bank",
          },
          //right_answer:{
              //type: String,
              //required: [true, "Please tell us the right answer of this question."],
          //},
          user_answer:{
              type: String,
              default:'Z',
          },
        },
      ],
      answer_2: [
        {
          question:{
            type: mongoose.Schema.ObjectId,
            ref:"Sub_public_ques_bank",
          },
          //right_answer:{
            //type: String,
            //required: [true, "Please tell us the right answer of this question."],
          //},
          user_answer:{
            type: String,
            default:'Z',
          },
        },
      ],
      answer_3: [
        {
          question:{
            type: mongoose.Schema.ObjectId,
            ref:"Professional_ques_bank",
          },
          //right_answer:{
            //type: String,
            //required: [true, "Please tell us the right answer of this question."],
          //},
          user_answer:{
            type: String,
            default:'Z',
          },
        },
      ],
      score_1:{
        type:Number,
        default:0,
      },
      score_2:{
        type:Number,
        default:0,
      },
      score_3:{
        type:Number,
        default:0,
      },
      start_time: {
        type: String,
     
      },
      submit_time: {
        type: String,

      },
    },
  ],
*/
});

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
