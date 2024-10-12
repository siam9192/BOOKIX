"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectId = exports.verifyToken = exports.generateJwtToken = exports.generateOTP = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
function generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }
    return otp;
}
exports.generateOTP = generateOTP;
const generateJwtToken = (payload, secret, expiresIn) => {
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn,
    });
};
exports.generateJwtToken = generateJwtToken;
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
const objectId = (id) => new mongoose_1.Types.ObjectId(id);
exports.objectId = objectId;
