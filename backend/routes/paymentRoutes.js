const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createPayment,
    completePayment,
    getPayment
} = require("../controllers/paymentController");

const router = express.Router();

// Create a payment
router.post("/create", protect, createPayment);

// Complete a payment
router.post("/:id/pay", protect, completePayment);

// Get payment details
router.get("/:id", protect, getPayment);

module.exports = router;