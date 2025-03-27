const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const userModel = require("../Models/User");

// Standardized API response format
exports.ApiResponse = (data = {}, message = "", status = true, total = 0) => {
  return { status, message, data, total };
};

// Generate a JWT token for a user
exports.generateToken = (user) => {
  try {
    return jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  } catch (error) {
    console.error("JWT Token Generation Error:", error);
    return null;
  }
};

// Middleware to validate token from request headers
exports.validateToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
    return res.status(401).json(exports.ApiResponse({}, "Unauthorized: No Token Provided", false));
  }

  req.token = bearerHeader.split(" ")[1]; // Extract JWT
  next();
};

// Helper function to verify token and attach user data to req
const verifyTokenHelper = async (req, res, role = null) => {
  try {
    if (!req.token) {
      return res.status(401).json(exports.ApiResponse({}, "Unauthorized: No Token Provided", false));
    }

    const decoded = jwt.verify(req.token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) {
      return res.status(401).json(exports.ApiResponse({}, "Invalid Token", false));
    }

    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json(exports.ApiResponse({}, "User not found", false));
    }

    // Attach user details to request
    req.user = { id: user._id, role: user.role, email: user.email };

    // Check role if specified
    if (role && user.role !== role) {
      return res.status(403).json(exports.ApiResponse({}, `Access Denied: ${role}s Only`, false));
    }

    return null; // No errors
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    return res.status(401).json(exports.ApiResponse({}, "Invalid or Expired Token", false));
  }
};

// Middleware to verify Admin
exports.verifyToken = async (req, res, next) => {
  const errorResponse = await verifyTokenHelper(req, res, "ADMIN");
  if (errorResponse) return errorResponse;
  next();
};

// Middleware to verify Employee
exports.verifyEmployeeToken = async (req, res, next) => {
  const errorResponse = await verifyTokenHelper(req, res, "EMPLOYEE");
  if (errorResponse) return errorResponse;
  next();
};

// Middleware to verify User and Active Status
exports.verifyUserToken = async (req, res, next) => {
  const errorResponse = await verifyTokenHelper(req, res, "USER");
  if (errorResponse) return errorResponse;

  const user = await userModel.findById(req.user.id);
  if (user.status !== "ACTIVE") {
    return res.status(403).json(exports.ApiResponse({}, "Access Denied: Inactive User", false));
  }

  next();
};
