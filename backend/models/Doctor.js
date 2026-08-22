const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},
    phone: {
    type: String,
    required: true
    },
    
    specialization:{
        type:String,
        required:true
    }
});

const Doctor =
    mongoose.models.Doctor ||
    mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
