const Patient = require("../models/Patient");


// ===============================
// Get logged-in patient's profile
// ===============================

const getMyPatientProfile = async (req, res) => {
    try {

        const patient = await Patient.findOne({
            userId: req.user.userId
        }).populate("userId", "name email role");

        if (!patient) {
            return res.status(404).json({
                message: "Patient profile not found"
            });
        }

        res.status(200).json({
            patient
        });

    } catch (error) {

        console.error("Get patient profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getMyPatientProfile
};