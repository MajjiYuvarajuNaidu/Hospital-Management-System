const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const bcrypt = require("bcrypt");


// ==================== CREATE DOCTOR ====================

const createDoctor = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            phone,
            specialization
        } = req.body;


        // Check required fields
        if (
            !name ||
            !email ||
            !password ||
            !phone ||
            !specialization
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }


        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }


        // Normalize email
        const normalizedEmail =
            email.trim().toLowerCase();


        // Check if user already exists
        const existingUser =
            await User.findOne({
                email: normalizedEmail
            });

        if (existingUser) {
            return res.status(400).json({
                message:
                    "User with this email already exists"
            });
        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create User
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "doctor"
        });


        try {

            // Create Doctor profile
            const doctor =
                await Doctor.create({
                    userId: user._id,
                    phone: phone.trim(),
                    specialization:
                        specialization.trim()
                });


            res.status(201).json({
                message:
                    "Doctor created successfully",
                doctor
            });

        } catch (doctorError) {

            // Roll back User if Doctor creation fails
            await User.findByIdAndDelete(
                user._id
            );

            throw doctorError;
        }


    } catch (error) {

        console.error(
            "Create doctor error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==================== GET DOCTORS ====================

const getDoctors = async (req, res) => {
    try {

        const doctors =
            await Doctor.find()
                .populate(
                    "userId",
                    "name email role"
                );

        res.status(200).json({
            doctors
        });

    } catch (error) {

        console.error(
            "Get doctors error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==================== GET DOCTOR BY ID ====================

const getDoctorById = async (req, res) => {
    try {

        // Validate ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid doctor ID"
            });
        }


        const doctor =
            await Doctor.findById(req.params.id)
                .populate(
                    "userId",
                    "name email role"
                );


        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }


        res.status(200).json({
            doctor
        });

    } catch (error) {

        console.error(
            "Get doctor error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==================== UPDATE DOCTOR ====================

const updateDoctor = async (req, res) => {
    try {

        // Validate ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid doctor ID"
            });
        }


        // Prevent changing sensitive fields
        const {
            name,
            email,
            password,
            role,
            ...doctorData
        } = req.body;


        // Update Doctor profile
        const doctor =
            await Doctor.findByIdAndUpdate(
                req.params.id,
                doctorData,
                {
                    new: true,
                    runValidators: true
                }
            );


        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }


        // Update name/email separately if provided
        if (name || email) {

            const updateUser = {};

            if (name) {
                updateUser.name = name.trim();
            }

            if (email) {
                updateUser.email =
                    email.trim().toLowerCase();
            }


            await User.findByIdAndUpdate(
                doctor.userId,
                updateUser,
                {
                    runValidators: true
                }
            );
        }


        res.status(200).json({
            message:
                "Doctor updated successfully",
            doctor
        });


    } catch (error) {

        console.error(
            "Update doctor error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==================== DELETE DOCTOR ====================

const deleteDoctor = async (req, res) => {
    try {

        // Validate ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid doctor ID"
            });
        }


        const doctor =
            await Doctor.findById(
                req.params.id
            );


        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }


        // Delete Doctor profile
        await Doctor.findByIdAndDelete(
            req.params.id
        );


        // Delete corresponding User
        await User.findByIdAndDelete(
            doctor.userId
        );


        res.status(200).json({
            message:
                "Doctor and user deleted successfully"
        });


    } catch (error) {

        console.error(
            "Delete doctor error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==================== EXPORT ====================

module.exports = {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
};