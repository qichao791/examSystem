const mongoose = require("mongoose");
// name, departId, branchId, photo, password

const userpaperSchema = new mongoose.Schema({
  user_id:{
    type: mongoose.Schema.Types.String,
    ref: 'User',
  },
  paper_id:{
        type: mongoose.Schema.Types.String,
        ref: "Paper",
  },
  is_finished:{
        type:Boolean,
        default:false,
  },
  public_questions: [
    {
          ques_id:{
              type: mongoose.Schema.Types.String,
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
                type: mongoose.Schema.Types.String,
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
                type: mongoose.Schema.Types.String,
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
  begin_time: {
        type: String,
     
  },
  submit_time: {
        type: String,
  },
});
//userpaperSchema.index({ user_id: 1, paper_id: 1}, { unique: true });// I'd like setting composite primary key 
const Userpaper = mongoose.model("Userpaper", userpaperSchema,'userpaper');
module.exports = Userpaper;
