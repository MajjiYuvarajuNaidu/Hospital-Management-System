// const express = require("express");

// const app = express();

// const PORT = 5001;

// app.get("/api/test", (req, res) => {
//     res.json({
//         success: true,
//         message: "Hospital API is working!"
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
const Patient = require("./models/Patient");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

app.get("/", (req, res) => {
    res.send("Hospital Management System API");
});

app.listen(5001, () => {
    console.log("Server running on port 5001");
});
