"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordMail = exports.sendEmailVerificationMail = void 0;
const config_1 = __importDefault(require("../config"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const AppError_1 = __importDefault(require("../Errors/AppError"));
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: config_1.default.app_user_name,
        pass: config_1.default.app_pass_key,
    },
});
const userVerificationEmailHtml = (otp) => {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: #333333;
            margin-bottom: 20px;
            text-align: center;
        }

        p {
            color: #666666;
            font-size: 16px;
            line-height: 1.6;
        }

        .verification-code {
            text-align: center;
            font-size: 24px;
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 6px;
        }

        .btn {
            display: inline-block;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin-top: 20px;
        }

        .btn:hover {
            background-color: #45a049;
        }

        @media only screen and (max-width: 500px) {
            .container {
                padding: 20px;
            }

            h2 {
                font-size: 24px;
            }

            p {
                font-size: 14px;
            }

            .verification-code {
                font-size: 20px;
            }

            .btn {
                display: block;
                width: 100%;
                margin-top: 10px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Email Verification</h2>
        <p>Dear User,</p>
        <p>Thank you for signing up. Please use the following verification code to complete your registration:</p>
        <div class="verification-code">
            <!-- Insert dynamic OTP code here -->
            <strong>${otp}</strong>
        </div>
         <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              Thank you for your registration request. Use the following OTP
              to complete the procedure to change your email address. OTP is
              valid for
              <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
              Do not share this code with others, including Archisketch
              employees.
            </p>
        <p>If you did not request this verification, please ignore this email.</p>
        <p>Best regards,<br>MovieBuzz Team</p>

    </div>
</body>

</html>

`;
};
const sendEmailVerificationMail = (emailAddress, otp) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: 'camperShop.email.@gmail.com',
        to: emailAddress,
        subject: 'Verify your Bookix account',
        html: userVerificationEmailHtml(otp),
    });
});
exports.sendEmailVerificationMail = sendEmailVerificationMail;
const sendMail = (emailAddress, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: 'camperShop.email.@gmail.com',
        to: emailAddress,
        subject: subject,
        html: html,
    });
});
const sendResetPasswordMail = (emailAddress, token) => __awaiter(void 0, void 0, void 0, function* () {
    const path = require('path');
    const fs = require('fs');
    // Path name of html template file
    const pathName = path.join(process.cwd(), 'template-forget-email', 'index.html');
    try {
        const data = yield fs.promises.readFile(pathName, 'utf8');
        if (!data) {
            throw new AppError_1.default(400, 'Something went wrong');
        }
        let template = data;
        //    Adding reset link in template
        template = template.replace('this is reset password link', `http://localhost:5173?token=${token}`);
        // Sending reset password  mail
        yield sendMail(emailAddress, 'Reset your password', template);
    }
    catch (error) {
        throw new AppError_1.default(400, 'Something went wrong');
    }
});
exports.sendResetPasswordMail = sendResetPasswordMail;
