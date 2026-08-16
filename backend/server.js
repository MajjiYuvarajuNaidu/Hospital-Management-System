const express = require("express");

const app = express();

const PORT = 5001;

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Hospital API is working!"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});