const mongoose = require("mongoose");

const MedicalRecord = require("../Models/medicalRecordModel");
const Appointment = require("../Models/Appointments");
const Doctor = require("../Models/Doctor");
const Patient = require("../Models/Patient");


// ======================================================
// CREATE MEDICAL RECORD
// ======================================================

const createMedicalRecord = async (req, res) => {
    try {

        const {
            appointment,
            diagnosis,
            symptoms,
            prescription,
            notes
        } = req.body;


        // Only doctors can create medical records
        if (req.user.role !== "doctor") {
            return res.status(403).json({
                message: "Only doctors can create medical records"
            });
        }


        // Check required fields
        if (
            !appointment ||
            !diagnosis ||
            !symptoms ||
            !prescription
        ) {
            return res.status(400).json({
                message:
                    "Appointment, diagnosis, symptoms and prescription are required"
            });
        }


        // Validate appointment ID
        if (!mongoose.isValidObjectId(appointment)) {
            return res.status(400).json({
                message: "Invalid appointment ID"
            });
        }


        // Validate text fields
        if (
            typeof diagnosis !== "string" ||
            diagnosis.trim().length < 2
        ) {
            return res.status(400).json({
                message: "Diagnosis must be at least 2 characters"
            });
        }

        if (
            typeof symptoms !== "string" ||
            symptoms.trim().length < 2
        ) {
            return res.status(400).json({
                message: "Symptoms must be at least 2 characters"
            });
        }

        if (
            typeof prescription !== "string" ||
            prescription.trim().length < 2
        ) {
            return res.status(400).json({
                message: "Prescription must be at least 2 characters"
            });
        }


        // ------------------------------------------------
        // Find doctor profile
        // ------------------------------------------------

        const doctor = await Doctor.findOne({
            userId: req.user.userId
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor profile not found"
            });
        }


        // ------------------------------------------------
        // Find appointment
        // ------------------------------------------------

        const existingAppointment =
            await Appointment.findById(appointment);

        if (!existingAppointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }


        // ------------------------------------------------
        // Appointment must be completed
        // ------------------------------------------------

        if (existingAppointment.status !== "completed") {
            return res.status(400).json({
                message:
                    "Medical record can only be created for completed appointments"
            });
        }


        // ------------------------------------------------
        // Appointment must belong to this doctor
        // ------------------------------------------------

        if (
            existingAppointment.doctor.toString() !==
            doctor._id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You can only create records for your appointments"
            });
        }


        // ------------------------------------------------
        // Check if medical record already exists
        // ------------------------------------------------

        const existingRecord =
            await MedicalRecord.findOne({
                appointment: existingAppointment._id
            });

        if (existingRecord) {
            return res.status(400).json({
                message:
                    "Medical record already exists for this appointment"
            });
        }


        // ------------------------------------------------
        // Verify patient exists
        // ------------------------------------------------

        const patient =
            await Patient.findById(
                existingAppointment.patient
            );

        if (!patient) {
            return res.status(404).json({
                message: "Patient profile not found"
            });
        }


        // ------------------------------------------------
        // Create medical record
        // ------------------------------------------------

        const medicalRecord =
            await MedicalRecord.create({

                patient:
                    existingAppointment.patient,

                doctor:
                    doctor._id,

                appointment:
                    existingAppointment._id,

                diagnosis:
                    diagnosis.trim(),

                symptoms:
                    symptoms.trim(),

                prescription:
                    prescription.trim(),

                notes:
                    notes ? notes.trim() : ""
            });


        // ------------------------------------------------
        // Response
        // ------------------------------------------------

        res.status(201).json({

            message:
                "Medical record created successfully",

            medicalRecord
        });


    } catch (error) {

        console.error(
            "Create medical record error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};



// ======================================================
// GET PATIENT RECORDS
// ======================================================

const getPatientRecords = async (req, res) => {
    try {

        const patientId = req.params.patientId;


        // Validate patient ID
        if (!mongoose.isValidObjectId(patientId)) {
            return res.status(400).json({
                message: "Invalid patient ID"
            });
        }


        // ------------------------------------------------
        // Find patient
        // ------------------------------------------------

        const patient =
            await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }


        // ------------------------------------------------
        // Patient can only view their own records
        // ------------------------------------------------

        if (req.user.role === "patient") {

            if (
                patient.userId.toString() !==
                req.user.userId
            ) {
                return res.status(403).json({
                    message:
                        "You are not authorized to view these medical records"
                });
            }
        }


        // ------------------------------------------------
        // Doctors can only view records belonging
        // to their own appointments
        // ------------------------------------------------

        if (req.user.role === "doctor") {

            const doctor =
                await Doctor.findOne({
                    userId: req.user.userId
                });

            if (!doctor) {
                return res.status(404).json({
                    message: "Doctor profile not found"
                });
            }

            const doctorAppointment =
                await Appointment.findOne({
                    doctor: doctor._id,
                    patient: patientId
                });

            if (!doctorAppointment) {
                return res.status(403).json({
                    message:
                        "You are not authorized to view these medical records"
                });
            }
        }


        // ------------------------------------------------
        // Get records
        // ------------------------------------------------

        const records =
            await MedicalRecord.find({
                patient: patientId
            })
                .populate({
                    path: "doctor",
                    populate: {
                        path: "userId",
                        select: "name email"
                    }
                })
                .populate("appointment");


        res.status(200).json(records);


    } catch (error) {

        console.error(
            "Get patient records error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};



// ======================================================
// GET DOCTOR RECORDS
// ======================================================

const getDoctorRecords = async (req, res) => {
    try {

        // Only doctors can access doctor records
        if (req.user.role !== "doctor") {
            return res.status(403).json({
                message: "Only doctors can access doctor records"
            });
        }


        // Find doctor profile
        const doctor =
            await Doctor.findOne({
                userId: req.user.userId
            });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor profile not found"
            });
        }


        // Get doctor's records
        const records =
            await MedicalRecord.find({
                doctor: doctor._id
            })
                .populate("patient")
                .populate("appointment");


        res.status(200).json(records);


    } catch (error) {

        console.error(
            "Get doctor records error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};



// ======================================================
// GET SINGLE MEDICAL RECORD
// ======================================================

const getMedicalRecordById = async (req, res) => {
    try {

        const recordId = req.params.id;


        // Validate medical record ID
        if (!mongoose.isValidObjectId(recordId)) {
            return res.status(400).json({
                message: "Invalid medical record ID"
            });
        }


        // Find record
        const record =
            await MedicalRecord.findById(recordId)
                .populate({
                    path: "doctor",
                    populate: {
                        path: "userId",
                        select: "name email"
                    }
                })
                .populate("patient")
                .populate("appointment");


        if (!record) {
            return res.status(404).json({
                message: "Medical record not found"
            });
        }


        // ------------------------------------------------
        // Patient can only view their own record
        // ------------------------------------------------

        if (req.user.role === "patient") {

            if (
                record.patient.userId.toString() !==
                req.user.userId
            ) {
                return res.status(403).json({
                    message:
                        "You are not authorized to view this medical record"
                });
            }
        }


        // ------------------------------------------------
        // Doctor can only view their own records
        // ------------------------------------------------

        if (req.user.role === "doctor") {

            if (
                record.doctor.userId.toString() !==
                req.user.userId
            ) {
                return res.status(403).json({
                    message:
                        "You are not authorized to view this medical record"
                });
            }
        }


        // ------------------------------------------------
        // Admin is not automatically allowed to view
        // medical records
        // ------------------------------------------------

        if (req.user.role === "admin") {
            return res.status(403).json({
                message:
                    "You are not authorized to view medical records"
            });
        }


        res.status(200).json(record);


    } catch (error) {

        console.error(
            "Get medical record error:",
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

    createMedicalRecord,

    getPatientRecords,

    getDoctorRecords,

    getMedicalRecordById

};