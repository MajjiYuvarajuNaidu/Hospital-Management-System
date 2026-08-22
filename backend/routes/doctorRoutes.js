const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const express = require("express");
const router = express.Router();

const {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
} = require("../Controllers/doctorController");

router.post("/", protect, authorizeRoles("admin"), createDoctor);

router.get("/", protect, authorizeRoles("admin", "patient"), getDoctors);

router.get("/:id", protect, authorizeRoles("admin"), getDoctorById);

router.put("/:id", protect, authorizeRoles("admin"), updateDoctor);

router.delete("/:id", protect, authorizeRoles("admin"), deleteDoctor);

module.exports = router;