const mongoose = require("mongoose");
const uuid = require("uuid");
////let paperID = uuid.v1().substring(0,10);//Generate the paperID with 4 charactors.

const paperSchema = new mongoose.Schema({
    _id:{
        type:String,
        required: [true, "Please tell us paper's ID"],
        default:uuid.v1,
        
    },
    paper_name: {
        type: String,
        required: [true, "Please tell us the paper's name."],
    },
    paper_batch: {
        type: String,
        required: [true, "Please tell us the paper's batch."],
    },
    paper_term: {
        type: String,
        required: [true, "Please tell us the paper's term."],
    },
    grade: {
        type: Number,
        default:2,
    },
    duration: {
        type: Number,//分钟
        required: [true, "Please tell us the paper's duration."],
    },
    start_time: {
        type: String,
        required: [true, "Please tell us the paper's start time."],
    },
    end_time: {
        type: String,
        required: [true, "Please tell us the paper's end time."],
    },
    is_resit: {
        type: Boolean,
        default:false,
    },
    bank_scale: {
        type: String,
        default:'50,30,20',
    },
    amount: {
        type: Number,
        default:0,
    },
},{_id:false});

const Paper = mongoose.model("Paper", paperSchema,'paper');
module.exports = Paper;
