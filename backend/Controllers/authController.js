const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Patient = require("../Models/Patient");

// ==================== REGISTER ====================

const registerUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            age,
            phone,
            gender
        } = req.body;

        // Public registration is always for patients
        const role = "patient";

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Validate patient-specific fields
        if (!age || !phone || !gender) {
            return res.status(400).json({
                message:
                    "Age, phone and gender are required for patients"
            });
        }

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role
        });

        // Create Patient profile
        await Patient.create({
            userId: user._id,
            age,
            phone,
            gender
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        });

    } catch (error) {

        console.error("Register error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==================== LOGIN ====================

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find user
        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    registerUser,
    loginUser
};