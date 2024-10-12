"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.nameSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const user_interface_1 = require("./user.interface");
exports.nameSchema = new mongoose_1.Schema({
    first_name: {
        type: String,
        required: true,
    },
    middle_name: {
        type: String,
        default: null,
    },
    last_name: {
        type: String,
        required: true,
    },
});
const notificationSchema = new mongoose_1.Schema({
    notification: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Notification',
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
});
const userSchema = new mongoose_1.Schema({
    name: {
        type: exports.nameSchema,
        required: true,
    },
    date_of_birth: {
        type: String,
        default: null,
    },
    gender: {
        type: String,
        enum: Object.values(user_interface_1.TGender),
        default: null,
    },
    google_id: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        select: 0,
        default: null,
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.TRole),
        required: true,
    },
    is_blocked: {
        type: Boolean,
        default: false,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    registered_by: {
        type: String,
        enum: Object.values(user_interface_1.TRegistrationOption),
        required: true,
    },
    notifications: {
        type: [notificationSchema],
        default: [],
        select: 0,
    },
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model('User', userSchema);
