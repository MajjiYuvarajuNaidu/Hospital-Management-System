const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
            unique: true
        },

        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "card", "upi"],
            default: "upi"
        },

        transactionId: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Payment =
    mongoose.models.Payment ||
    mongoose.model("Payment", paymentSchema);

module.exports = Payment;