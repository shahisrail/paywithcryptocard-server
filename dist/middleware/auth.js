"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers?.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new errors_1.AppError('Authentication required. Please log in.', 401);
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        next(new errors_1.AppError('Invalid or expired token. Please log in again.', 401));
    }
};
exports.authenticate = authenticate;
const authorizeAdmin = async (req, res, next) => {
    try {
        if (req.user?.role !== 'admin') {
            throw new errors_1.AppError('Access denied. Admin privileges required.', 403);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authorizeAdmin = authorizeAdmin;
