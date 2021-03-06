const mongoose = require("mongoose");
const uuid = require("../node_modules/uuid/dist");

const subpublicbankSchema = new mongoose.Schema({
    _id:{
        type:String,
        required: [true, "Please tell us question's ID"],
        default:uuid.v1,

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
               type:String,
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
        image: [
            String
           //"https://wiki.wannax.cn/stastic/000000.jpg",
        ],
        voice: [
            String
            //"https://wiki.wannax.cn/weixin/music/liang.mp3"
        ],
        video: [
            String
            //"https://wiki.wannax.cn/weixin/videos/trailer.mp4"
        ]
    
    },
    right_times:{
        type: Number,
        default:10,
    },
    wrong_times:{
        type: Number,
        default:10,
    }
},{_id:false});

const Subpublicbank = mongoose.model("Subpublicbank", subpublicbankSchema,'subpublicbank');
module.exports = Subpublicbank;
