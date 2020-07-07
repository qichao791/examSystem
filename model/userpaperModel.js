const mongoose = require("mongoose");
// name, departId, branchId, photo, password

const userpaperSchema = new mongoose.Schema({
  user_id:{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  paper_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paper",
  },
  is_finished:{
        type:Boolean,
        default:false,
  },
  public_questions: [
    {
          ques_id:{
              type: mongoose.Schema.Types.ObjectId,
              ref:"Questionbank",
          },
          user_answer:{
              type: String,
              default:'Z',
          },
    },
  ],
  public_score:{
        type:Number,
        default:0,
  },
  subpublic_questions: [
    {
            ques_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Subpublicbank",
            },
            user_answer:{
                type: String,
                default:'Z',
            },
      },
  ],
  subpublic_score:{
          type:Number,
          default:0,
  },
  professional_questions: [
   {
            ques_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Professionalbank",
            },
            user_answer:{
                type: String,
                default:'Z',
            },
   },
  ],
  professional_score:{
          type:Number,
          default:0,
  },
  start_time: {
        type: String,
     
  },
  submit_time: {
        type: String,
  },
});

const Userpaper = mongoose.model("User", userpaperSchema,'userpaper');
module.exports = Userpaper;
