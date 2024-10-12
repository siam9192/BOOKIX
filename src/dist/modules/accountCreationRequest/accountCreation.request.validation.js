"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountCreationRequestValidations = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("../user/user.interface");
const createAccountCreationRequestValidation = zod_1.z.object({
    name: zod_1.z.object({
        first_name: zod_1.z.string(),
        middle_name: zod_1.z.string().optional(),
        last_name: zod_1.z.string().optional(),
    }),
    role: zod_1.z.enum(Object.values(user_interface_1.TRole)),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const verifyOtpValidations = zod_1.z.object({
    secret: zod_1.z.string(),
    otp: zod_1.z.string(),
});
const resendOtpValidation = zod_1.z.object({
    secret: zod_1.z.string(),
    requestTime: zod_1.z.string(),
});
exports.AccountCreationRequestValidations = {
    createAccountCreationRequestValidation,
    verifyOtpValidations,
    resendOtpValidation,
};
