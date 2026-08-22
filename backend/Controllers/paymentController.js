const mongoose = require("mongoose");

const Payment = require("../Models/Payment");
const Appointment = require("../Models/Appointments");
const Patient = require("../Models/Patient");


// ======================================================
// CREATE PAYMENT
// ======================================================

const createPayment = async (req, res) => {
    try {

        const {
            appointmentId,
            amount,
            paymentMethod
        } = req.body;


        // ------------------------------------------------
        // Check required fields
        // ------------------------------------------------

        if (!appointmentId || amount === undefined) {
            return res.status(400).json({
                message: "Appointment ID and amount are required"
            });
        }


        // ------------------------------------------------
        // Validate appointment ID
        // ------------------------------------------------

        if (!mongoose.isValidObjectId(appointmentId)) {
            return res.status(400).json({
                message: "Invalid appointment ID"
            });
        }


        // ------------------------------------------------
        // Validate amount
        // ------------------------------------------------

        if (
            typeof amount !== "number" ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return res.status(400).json({
                message: "Amount must be a positive number"
            });
        }


        // ------------------------------------------------
        // Validate payment method
        // ------------------------------------------------

        const allowedPaymentMethods = [
            "upi",
            "card",
            "cash"
        ];

        if (
            paymentMethod &&
            !allowedPaymentMethods.includes(paymentMethod)
        ) {
            return res.status(400).json({
                message: "Invalid payment method"
            });
        }


        // ------------------------------------------------
        // Find logged-in patient's profile
        // ------------------------------------------------

        const patient = await Patient.findOne({
            userId: req.user.userId
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient profile not found"
            });
        }


        // ------------------------------------------------
        // Find appointment
        // ------------------------------------------------

        const appointment =
            await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }


        // ------------------------------------------------
        // Make sure appointment belongs to patient
        // ------------------------------------------------

        if (
            appointment.patient.toString() !==
            patient._id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You can only pay for your own appointment"
            });
        }


        // ------------------------------------------------
        // Check appointment status
        // ------------------------------------------------

        if (
            appointment.status === "cancelled" ||
            appointment.status === "completed"
        ) {
            return res.status(400).json({
                message:
                    "Payment cannot be created for this appointment"
            });
        }


        // ------------------------------------------------
        // Check if payment already exists
        // ------------------------------------------------

        const existingPayment =
            await Payment.findOne({
                appointment: appointmentId
            });

        if (existingPayment) {
            return res.status(400).json({
                message:
                    "Payment already exists for this appointment"
            });
        }


        // ------------------------------------------------
        // Create payment
        // ------------------------------------------------

        const payment =
            await Payment.create({

                appointment:
                    appointmentId,

                patient:
                    patient._id,

                amount,

                paymentMethod:
                    paymentMethod || "upi"
            });


        res.status(201).json({
            message: "Payment created successfully",
            payment
        });


    } catch (error) {

        console.error(
            "Create payment error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};



// ======================================================
// COMPLETE PAYMENT
// ======================================================

const completePayment = async (req, res) => {
    try {

        const { id } = req.params;
        const { transactionId } = req.body;


        // ------------------------------------------------
        // Validate payment ID
        // ------------------------------------------------

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid payment ID"
            });
        }


        // ------------------------------------------------
        // Validate transaction ID
        // ------------------------------------------------

        if (
            transactionId !== undefined &&
            (
                typeof transactionId !== "string" ||
                transactionId.trim().length < 3
            )
        ) {
            return res.status(400).json({
                message: "Invalid transaction ID"
            });
        }


        // ------------------------------------------------
        // Find payment
        // ------------------------------------------------

        const payment =
            await Payment.findById(id);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }


        // ------------------------------------------------
        // Find logged-in patient
        // ------------------------------------------------

        const patient =
            await Patient.findOne({
                userId: req.user.userId
            });

        if (!patient) {
            return res.status(404).json({
                message: "Patient profile not found"
            });
        }


        // ------------------------------------------------
        // Ownership check
        // ------------------------------------------------

        if (
            payment.patient.toString() !==
            patient._id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You can only pay for your own payment"
            });
        }


        // ------------------------------------------------
        // Prevent duplicate payment
        // ------------------------------------------------

        if (payment.status === "paid") {
            return res.status(400).json({
                message:
                    "Payment is already completed"
            });
        }


        // ------------------------------------------------
        // Complete payment
        // ------------------------------------------------

        payment.status = "paid";

        payment.transactionId =
            transactionId
                ? transactionId.trim()
                : `TXN-${Date.now()}`;


        await payment.save();


        res.status(200).json({
            message:
                "Payment completed successfully",
            payment
        });


    } catch (error) {

        console.error(
            "Complete payment error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};



// ======================================================
// GET PAYMENT
// ======================================================

const getPayment = async (req, res) => {
    try {

        const { id } = req.params;


        // ------------------------------------------------
        // Validate payment ID
        // ------------------------------------------------

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid payment ID"
            });
        }


        // ------------------------------------------------
        // Find payment
        // ------------------------------------------------

        const payment =
            await Payment.findById(id)
                .populate("appointment")
                .populate("patient");


        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }


        // ------------------------------------------------
        // Find logged-in patient
        // ------------------------------------------------

        const patient =
            await Patient.findOne({
                userId: req.user.userId
            });

        if (!patient) {
            return res.status(404).json({
                message: "Patient profile not found"
            });
        }


        // ------------------------------------------------
        // Ownership check
        // ------------------------------------------------

        if (
            payment.patient._id.toString() !==
            patient._id.toString()
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }


        res.status(200).json({
            payment
        });


    } catch (error) {

        console.error(
            "Get payment error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};



// ======================================================
// EXPORT
// ======================================================

module.exports = {
    createPayment,
    completePayment,
    getPayment
};