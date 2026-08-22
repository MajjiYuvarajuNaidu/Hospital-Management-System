
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const medicalRecordRoutes = require("./Routes/medicalRecordRoutes");
const patientRoutes = require("./Routes/patientRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
require("dotenv").config();


const app = express();
app.use(cors());
app.get("/", (req, res) => {
    res.send("Hospital Management System API");
});
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });



app.use(express.json());
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

app.listen(5001, () => {
    console.log("Server running on port 5001");
});

