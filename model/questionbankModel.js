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
        options: [  String  ],
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

const Quesitonbank = mongoose.model("Quesitonbank", questionbankSchema,'questionbank');
module.exports = Quesitonbank;
