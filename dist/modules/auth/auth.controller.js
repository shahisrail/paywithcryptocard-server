"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../../models/User");
const jwt_1 = require("../../utils/jwt");
const errors_1 = require("../../utils/errors");
const register = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        // Check if user already exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            throw new errors_1.AppError('User with this email already exists', 409);
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create new user
        const user = await User_1.User.create({
            email,
            password: hashedPassword,
            fullName,
        });
        // Generate token
        const token = (0, jwt_1.generateToken)({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        const response = {
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                balance: user.balance,
            },
        };
        res.status(201).json(response);
    }
    catch (error) {
        throw error;
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user and include password for comparison
        const user = await User_1.User.findOne({ email }).select('+password');
        if (!user) {
            throw new errors_1.AppError('Invalid email or password', 401);
        }
        // Check if user is active
        if (!user.isActive) {
            throw new errors_1.AppError('Your account has been deactivated. Please contact support.', 403);
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new errors_1.AppError('Invalid email or password', 401);
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        const response = {
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                balance: user.balance,
            },
        };
        res.status(200).json(response);
    }
    catch (error) {
        throw error;
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    }
    catch (error) {
        throw error;
    }
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user?.userId);
        if (!user) {
            throw new errors_1.AppError('User not found', 404);
        }
        res.status(200).json({
            success: true,
            data: {
                id: user._id.toString(),
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                balance: user.balance,
                isActive: user.isActive,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getMe = getMe;
