const mongoose = require("mongoose");
const uuid = require("../node_modules/uuid/dist");

const groupSchema = new mongoose.Schema({
    _id:{
        type:String,
        required: [true, "Please tell us group's ID"],
        default:uuid.v1,
    },
    group_name: {
        type: String,
        required: [true, "Please tell us the group's name."],
    },
    users: [
        {
            type: mongoose.Schema.Types.String,
            ref:"User",
        },
    ],
},{_id:false});

const Group = mongoose.model("Group", groupSchema,'group');
module.exports = Group;