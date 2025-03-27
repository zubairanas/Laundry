const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const { ApiResponse } = require("../Helpers");

// General Authentication Middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json(ApiResponse({}, "Unauthorized: No Token Provided", false));
        }

        const extractedToken = token.replace("Bearer ", "").trim();
        console.log("Received Token:", extractedToken); // Debugging

        let decoded;
        try {
            decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
        } catch (err) {
            console.error("JWT Verification Error:", err.message);
            return res.status(401).json(ApiResponse({}, "Invalid or Expired Token", false));
        }

        if (!decoded || !decoded.id) {
            return res.status(401).json(ApiResponse({}, "Unauthorized: Invalid Token", false));
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json(ApiResponse({}, "User Not Found", false));
        }

        req.user = { id: user._id, role: user.role, email: user.email };
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json(ApiResponse({}, "Server Error", false));
    }
};

// Role-Based Middleware
const verifyRole = (role) => {
    return async (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json(ApiResponse({}, `Access Denied: ${role}s Only`, false));
        }
        next();
    };
};

module.exports = {
    authMiddleware,
    verifyAdmin: verifyRole("ADMIN"),
    verifyEmployee: verifyRole("EMPLOYEE"),
    verifyUser: verifyRole("USER")
};
