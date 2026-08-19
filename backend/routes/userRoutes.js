const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/profile", protect, (req, res) => {

    res.json({
        message: "You accessed a protected route",
        user: req.user
    });

});

router.get("/admin-test", protect, authorizeRoles("admin"), (req, res) => {

    res.json({
        message: "Welcome Admin"
    });

});

module.exports = router;