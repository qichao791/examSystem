const mongoose = require("mongoose");
const uuid = require("uuid");

const subpublicbankSchema = new mongoose.Schema({
    _id:{
        type:String,
        required: [true, "Please tell us question's ID"],
        default:uuid.v1,
        unique:true,
    },
    depart_id:{
        type: mongoose.Schema.Types.String,
        ref: 'Depart',
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
},{_id:false});

const Subpublicbank = mongoose.model("Subpublicbank", subpublicbankSchema,'subpublicbank');
module.exports = Subpublicbank;
