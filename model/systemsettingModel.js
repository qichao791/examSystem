const mongoose = require("mongoose");

const systemsettingSchema = new mongoose.Schema({
    is_faceRecognition:{
        type: Boolean,
        default: false,
    }
});

const Systemsetting = mongoose.model("Systemsetting", systemsettingSchema, 'systemsetting');
module.exports = Systemsetting;
