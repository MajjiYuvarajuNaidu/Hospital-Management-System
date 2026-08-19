const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
      userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},

    age: {
        type: Number,
        required: true
    },

    phone: {
    type: String,
    required: true
    },

    gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
    }
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
