const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getAdminDashboard
} = require("../Controllers/adminController");


router.get(
    "/dashboard",
    protect,
    authorizeRoles("admin"),
    getAdminDashboard
);


module.exports = router;