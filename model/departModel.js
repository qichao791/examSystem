const mongoose = require("mongoose");
const uuid = require("uuid");
//let departID = uuid.v1().substring(0,4);//Generate the departID with 4 charactors.

const departSchema = new mongoose.Schema({
    _id:{
        type:String,
        required: [true, "Please tell us department's ID"],
        default:uuid.v1,
        
    },
    depart_name: {
        type: String,
        required: [true, "Please tell us the department's name."],
    },
    branches: [
        {
            type: mongoose.Schema.Types.String,//type: mongoose.Schema.Types.ObjectID,
            ref: 'Branch',
        },
    ],

},{_id:false});

const Depart = mongoose.model("Depart", departSchema,'department');
module.exports = Depart;
