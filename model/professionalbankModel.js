const mongoose = require("mongoose");
const uuid = require("uuid");

const professionalbankSchema = new mongoose.Schema({
    ques_id:{
        type:String,
        required: [true, "Please tell us question's ID"],
        default:uuid.v1,
        unique:true,
    },
    depart_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    branch_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
    },
    statement: {
        stem:{
            type: String,
            required: [true, "Please tell us the question's statement."],
        },
        options: [    
            {
                option_name:String,
                option_value:String,
                is_answer:{type:Boolean,default:false,},
            },        
        ],
    },
    
    analysis: {
        type: String,
    },
    knowlege: {
        type: String,
    },
    grade: {
        type: Number,
        default:2,
    },
    attachment:{
        type:String,
    },
});

const Professionalbank = mongoose.model("Professionalbank", professionalbankSchema);
module.exports = Professionalbank;
