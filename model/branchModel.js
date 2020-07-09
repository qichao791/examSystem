const mongoose = require("mongoose");

const uuid = require("uuid");
//let branchID = uuid.v1().substring(0,4);//Generate the branchID with 4 charactors.

const branchSchema = new mongoose.Schema({
    //
    _id:{
        type:String,
        required: [true, "Please tell us branch's ID"],
        default:uuid.v1,
    },  
    
    branch_name: {
        type: String,
        required: [true, "Please tell us the department's name."],
    },
    
},{_id:false}); 

const Branch = mongoose.model("Branch", branchSchema,'branch');
module.exports = Branch;