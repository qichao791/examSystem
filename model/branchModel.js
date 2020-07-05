const mongoose = require("mongoose");
const uuid = require("uuid");
//let branchID = uuid.v1().substring(0,4);//Generate the branchID with 4 charactors.

const branchSchema = new mongoose.Schema({
    branch_id:{
        type:String,
        required: [true, "Please tell us branch's ID"],
        default:uuid.v1,
        unique:true,
    },  
    
    branch_name: {
        type: String,
        required: [true, "Please tell us the department's name."],
    },
});

const Branch = mongoose.model("Branch", branchSchema);
module.exports = Branch;