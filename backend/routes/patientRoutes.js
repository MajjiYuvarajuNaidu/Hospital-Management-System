const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getMyPatientProfile
} = require("../Controllers/patientController");


router.get(
    "/me",
    protect,
    authorizeRoles("patient"),
    getMyPatientProfile
);


module.exports = router;