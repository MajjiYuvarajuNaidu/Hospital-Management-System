const User = require("../Models/User");
const Doctor = require("../Models/Doctor");
const Patient = require("../Models/Patient");
const Appointment = require("../Models/Appointments");


// ======================================================
// GET ADMIN DASHBOARD
// ======================================================

const getAdminDashboard = async (req, res) => {
    try {

        // ==============================
        // BASIC COUNTS
        // ==============================

        const totalUsers = await User.countDocuments();

        const totalDoctors = await Doctor.countDocuments();

        const totalPatients = await Patient.countDocuments();

        const totalAppointments = await Appointment.countDocuments();


        // ==============================
        // APPOINTMENT STATUS COUNTS
        // ==============================

        const pendingAppointments =
            await Appointment.countDocuments({
                status: "pending"
            });

        const confirmedAppointments =
            await Appointment.countDocuments({
                status: "confirmed"
            });

        const completedAppointments =
            await Appointment.countDocuments({
                status: "completed"
            });

        const cancelledAppointments =
            await Appointment.countDocuments({
                status: "cancelled"
            });


        // ==============================
        // RECENT APPOINTMENTS
        // ==============================

        const recentAppointments =
            await Appointment.find()
                .populate({
                    path: "patient",
                    populate: {
                        path: "userId",
                        select: "name email"
                    }
                })
                .populate({
                    path: "doctor",
                    populate: {
                        path: "userId",
                        select: "name email"
                    }
                })
                .sort({ date: -1 })
                .limit(5);


        // ==============================
        // RESPONSE
        // ==============================

        res.status(200).json({

            totalUsers,

            totalDoctors,

            totalPatients,

            totalAppointments,

            appointments: {
                pending: pendingAppointments,
                confirmed: confirmedAppointments,
                completed: completedAppointments,
                cancelled: cancelledAppointments
            },

            recentAppointments
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch admin dashboard data"
        });
    }
};


module.exports = {
    getAdminDashboard
};


