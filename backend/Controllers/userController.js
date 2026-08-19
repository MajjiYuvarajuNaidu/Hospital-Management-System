const getProfile = async (req, res) => {

    try {

        res.status(200).json({
            message: "Profile accessed successfully",
            user: req.user
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }
};

module.exports = {
    getProfile
};