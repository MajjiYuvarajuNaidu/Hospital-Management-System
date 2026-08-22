const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createAppointment,
    confirmAppointment,
    cancelAppointment,
    completeAppointment
} = require("../Controllers/appointmentController");


// Patient books appointment
router.post(
    "/",
    protect,
    authorizeRoles("patient"),
    createAppointment
);


// Doctor/Admin confirms appointment
router.put(
    "/:id/confirm",
    protect,
    authorizeRoles("doctor", "admin"),
    confirmAppointment
);


// Patient/Doctor/Admin can cancel appointment
router.put(
    "/:id/cancel",
    protect,
    authorizeRoles("patient", "doctor", "admin"),
    cancelAppointment
);


// Doctor completes appointment
router.put(
    "/:id/complete",
    protect,
    authorizeRoles("doctor"),
    completeAppointment
);


module.exports = router;