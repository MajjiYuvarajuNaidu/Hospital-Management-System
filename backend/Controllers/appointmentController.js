const mongoose = require("mongoose");
const Appointment = require("../models/Appointments");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// ===============================
// Create Appointment
// ===============================
const createAppointment = async (req, res) => {
    try {
        const { doctor, date, reason } = req.body;

        // Validate required fields
        if (!doctor || !date || !reason) {
            return res.status(400).json({
                message: "Doctor, date and reason are required"
            });
        }

        // Validate doctor ID
        if (!mongoose.isValidObjectId(doctor)) {
            return res.status(400).json({
                message: "Invalid doctor ID"
            });
        }

        // Validate reason
        if (typeof reason !== "string" || reason.trim().length < 3) {
            return res.status(400).json({
                message: "Reason must be at least 3 characters"
            });
        }

        // Validate date
        const appointmentDate = new Date(date);

        if (isNaN(appointmentDate.getTime())) {
            return res.status(400).json({
                message: "Invalid appointment date"
            });
        }

        // Check if doctor exists
        const doctorExists = await Doctor.findById(doctor);

        if (!doctorExists) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        // Check if doctor already has an active appointment
        const existingAppointment = await Appointment.findOne({
            doctor,
            date: appointmentDate,
            status: { $in: ["pending", "confirmed"] }
        });

        if (existingAppointment) {
            return res.status(409).json({
                message: "Doctor is already booked for this time"
            });
        }

        // Find patient profile
        const patient = await Patient.findOne({
            userId: req.user.userId
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient profile not found"
            });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patient: patient._id,
            doctor,
            date: appointmentDate,
            reason: reason.trim()
        });

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment
        });

    } catch (error) {
        console.error("Create appointment error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// Confirm Appointment
// ===============================
const confirmAppointment = async (req, res) => {
    try {

        // Validate appointment ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid appointment ID"
            });
        }

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // If doctor is confirming,
        // find Doctor profile using logged-in User ID
        if (req.user.role === "doctor") {

            const doctor = await Doctor.findOne({
                userId: req.user.userId
            });

            if (!doctor) {
                return res.status(404).json({
                    message: "Doctor profile not found"
                });
            }

            // Check if appointment belongs to this doctor
            if (
                appointment.doctor.toString() !==
                doctor._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You are not authorized to confirm this appointment"
                });
            }
        }

        // Only pending appointments can be confirmed
        if (appointment.status !== "pending") {
            return res.status(400).json({
                message: "Only pending appointments can be confirmed"
            });
        }

        appointment.status = "confirmed";

        await appointment.save();

        res.status(200).json({
            message: "Appointment confirmed",
            appointment
        });

    } catch (error) {

        console.error("Confirm appointment error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// Cancel Appointment
// ===============================
const cancelAppointment = async (req, res) => {
    try {

        // Validate appointment ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid appointment ID"
            });
        }

        const appointment =
            await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // Patient can only cancel their own appointment
        if (req.user.role === "patient") {

            const patient = await Patient.findOne({
                userId: req.user.userId
            });

            if (!patient) {
                return res.status(404).json({
                    message: "Patient profile not found"
                });
            }

            if (
                appointment.patient.toString() !==
                patient._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You are not authorized to cancel this appointment"
                });
            }
        }

        // Doctor can only cancel their own appointments
        if (req.user.role === "doctor") {

            const doctor = await Doctor.findOne({
                userId: req.user.userId
            });

            if (!doctor) {
                return res.status(404).json({
                    message: "Doctor profile not found"
                });
            }

            if (
                appointment.doctor.toString() !==
                doctor._id.toString()
            ) {
                return res.status(403).json({
                    message:
                        "You are not authorized to cancel this appointment"
                });
            }
        }

        // Completed appointments cannot be cancelled
        if (appointment.status === "completed") {
            return res.status(400).json({
                message:
                    "Completed appointment cannot be cancelled"
            });
        }

        // Already cancelled
        if (appointment.status === "cancelled") {
            return res.status(400).json({
                message: "Appointment is already cancelled"
            });
        }

        appointment.status = "cancelled";

        await appointment.save();

        res.status(200).json({
            message: "Appointment cancelled",
            appointment
        });

    } catch (error) {

        console.error("Cancel appointment error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// Complete Appointment
// ===============================
const completeAppointment = async (req, res) => {
    try {

        // Validate appointment ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid appointment ID"
            });
        }

        const appointment =
            await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        // Find Doctor profile using logged-in User ID
        const doctor = await Doctor.findOne({
            userId: req.user.userId
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor profile not found"
            });
        }

        // Doctor can only complete their own appointment
        if (
            appointment.doctor.toString() !==
            doctor._id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You are not authorized to complete this appointment"
            });
        }

        // Only confirmed appointments can be completed
        if (appointment.status !== "confirmed") {
            return res.status(400).json({
                message:
                    "Only confirmed appointments can be completed"
            });
        }

        appointment.status = "completed";

        await appointment.save();

        res.status(200).json({
            message: "Appointment completed",
            appointment
        });

    } catch (error) {

        console.error("Complete appointment error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// EXPORT
// ===============================

module.exports = {
    createAppointment,
    confirmAppointment,
    cancelAppointment,
    completeAppointment
};