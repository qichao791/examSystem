const mongoose = require("mongoose");

const systemsettingSchema = new mongoose.Schema({
    is_faceRecognition:{
        type: Boolean,
        default: false,
    },
    resolution:{
        type: String,
        required: [true, "Please tell us the resolution."],
    },
    threshole:{
        type: Number,
        default: 50,
        required: [true, "Please tell us the threshole."],
    }
});

const Systemsetting = mongoose.model("Systemsetting", systemsettingSchema, 'systemsetting');
module.exports = Systemsetting;
