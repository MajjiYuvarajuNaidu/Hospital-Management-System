const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createMedicalRecord,
    getPatientRecords,
    getDoctorRecords,
    getMedicalRecordById
} = require("../Controllers/medicalRecordController");


// Doctor creates record
router.post(
    "/",
    protect,
    authorizeRoles("doctor"),
    createMedicalRecord
);


// Patient gets their records
router.get(
    "/patient/:patientId",
    protect,
    getPatientRecords
);


// Doctor gets their records
router.get(
    "/doctor",
    protect,
    authorizeRoles("doctor"),
    getDoctorRecords
);


// Get one record
router.get(
    "/:id",
    protect,
    getMedicalRecordById
);

module.exports = router;