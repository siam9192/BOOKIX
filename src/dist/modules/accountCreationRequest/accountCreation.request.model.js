"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountCreationRequest = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const accountRequestSchema = new mongoose_1.Schema({
    name: {
        type: user_model_1.nameSchema,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.TRole),
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
accountRequestSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 300 });
exports.AccountCreationRequest = (0, mongoose_1.model)('AccountCreationRequest', accountRequestSchema);
