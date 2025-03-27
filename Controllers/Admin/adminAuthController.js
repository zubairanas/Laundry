const { ApiResponse, generateToken, generateString } = require("../../Helpers");
const sanitizeUser = require("../../Helpers/sanitizeUser");
const User = require("../../Models/User");
const Reset = require("../../Models/Reset");
const { createResetToken, validateResetToken } = require("../../Helpers/verification");
const { generateEmail } = require("../../Helpers/email");

// Register Admin
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json(ApiResponse({}, "All fields are required", false));
        }

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(ApiResponse({}, "User with this Email Already Exists", false));
        }

        const user = new User({
            firstName,
            lastName,
            email,
            password,
            role: "ADMIN",
            status: "ACTIVE"
        });

        await user.save();
        return res.status(201).json(ApiResponse({ user: sanitizeUser(user) }, "Admin Created Successfully", true));
    } catch (error) {
        console.error(error);
        return res.status(500).json(ApiResponse({}, error.message, false));
    }
};

// Admin Sign-in
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json(ApiResponse({}, "Email and Password are required", false));
        }

        const user = await User.findOne({ email, role: "ADMIN" });
        if (!user || !user.authenticate(password)) {
            return res.status(401).json(ApiResponse({}, "Invalid email or password", false));
        }

        const token = generateToken(user);
        return res.status(200).json(ApiResponse({ user: sanitizeUser(user), token }, "Admin Logged In Successfully", true));
    } catch (error) {
        return res.status(500).json(ApiResponse({}, error.message, false));
    }
};

// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json(ApiResponse({}, "Unauthorized access", false));
        }

        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json(ApiResponse({}, "Admin not found", false));
        }

        return res.status(200).json(ApiResponse({ user: sanitizeUser(user) }, "Admin Profile Retrieved", true));
    } catch (error) {
        return res.status(500).json(ApiResponse({}, error.message, false));
    }
};

// Edit Admin Profile
exports.editProfile = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        if (!req.user?.id) {
            return res.status(401).json(ApiResponse({}, "Unauthorized access", false));
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json(ApiResponse({}, "User not found", false));
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json(ApiResponse({}, "Email is already taken", false));
            }
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;

        await user.save();
        return res.status(200).json(ApiResponse({ user: sanitizeUser(user) }, "Profile updated successfully", true));
    } catch (error) {
        return res.status(500).json(ApiResponse({}, error.message, false));
    }
};

// Send Email Verification Code
exports.emailVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json(ApiResponse({}, "User does not exist", false));
        }

        const verificationCode = generateString(4, false, true);
        await createResetToken(email, verificationCode);

        const html = `<div>
                        <p>Your verification code is <strong>${verificationCode}</strong></p>
                        <p>If you did not request this, please ignore this email.</p>
                      </div>`;
        await generateEmail(email, "Admin - Verification Code", html);

        return res.status(200).json(ApiResponse({}, "Verification code sent", true));
    } catch (error) {
        return res.status(500).json(ApiResponse({}, error.message, false));
    }
};

// Verify Recovery Code
exports.verifyRecoverCode = async (req, res) => {
    try {
        const { code, email } = req.body;
        if (await validateResetToken(code, email)) {
            return res.status(200).json(ApiResponse({}, "Verification Code Verified", true));
        }
        return res.status(400).json(ApiResponse({}, "Invalid Verification Code", false));
    } catch (error) {
        return res.status(500).json(ApiResponse({}, error.message, false));
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirm_password, code, email } = req.body;
        if (password !== confirm_password) {
            return res.status(400).json(ApiResponse({}, "Passwords do not match", false));
        }

        if (!await validateResetToken(code, email)) {
            return res.status(400).json(ApiResponse({}, "Invalid or expired code", false));
        }

        const user = await User.findOne({ email });
        user.password = password;
        await user.save();
        await Reset.deleteOne({ code, email });

        return res.status(200).json(ApiResponse({}, "Password updated successfully", true));
    } catch (error) {
        return res.status(500).json(ApiResponse({}, error.message, false));
    }
};
