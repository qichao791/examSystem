const mongoose = require("mongoose");
const uuid = require("uuid");

const questionbankSchema = new mongoose.Schema({
    _id:{
        type:String,
        required: [true, "Please tell us question's ID"],
        default:uuid.v1,

    },
    statement: {
        stem:{
            type: String,
            required: [true, "Please tell us the question's statement."],
        },
        options: [  
            {
               type: String,
            },
        ],
        right_answer:{
            type:String,
            required: [true, "Please tell us the answer."],
        }
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
        default:"/attachment/*.file"
    },
},{_id:false});

const Quesitonbank = mongoose.model("Quesitonbank", questionbankSchema,'questionbank');
module.exports = Quesitonbank;
