const mongoose = require("mongoose");
const uuid = require("uuid");
//let departID = uuid.v1().substring(0,4);//Generate the departID with 4 charactors.

const departSchema = new mongoose.Schema({
    depart_id:{
        type:String,
        required: [true, "Please tell us department's ID"],
        default:uuid.v1,
        unique:true,
    },
    depart_name: {
        type: String,
        required: [true, "Please tell us the department's name."],
    },
    branch_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
        },
    ],

});

const Department = mongoose.model("Department", departSchema);
module.exports = Department;
