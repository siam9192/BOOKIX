import config from '../config';
import nodemailer from 'nodemailer';
import AppError from '../Errors/AppError';
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: config.app_user_name,
    pass: config.app_pass_key,
  },
});

const userVerificationEmailHtml = (otp: string) => {
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
export const sendEmailVerificationMail = async (
  emailAddress: string,
  otp: string,
) => {
  await transporter.sendMail({
    from: 'camperShop.email.@gmail.com',
    to: emailAddress,
    subject: 'Verify your Bookix account',
    html: userVerificationEmailHtml(otp),
  });
};

const sendMail = async (
  emailAddress: string,
  subject: string,
  html: string,
) => {
  await transporter.sendMail({
    from: 'camperShop.email.@gmail.com',
    to: emailAddress,
    subject: subject,
    html: html,
  });
};

export const sendResetPasswordMail = async (
  emailAddress: string,
  token: string,
) => {
  const path = require('path');
  const fs = require('fs');

  // Path name of html template file
  const pathName = path.join(
    process.cwd(),
    'template-forget-email',
    'index.html',
  );
  try {
    const data = await fs.promises.readFile(pathName, 'utf8');

    if (!data) {
      throw new AppError(400, 'Something went wrong');
    }

    let template = data;
    //    Adding reset link in template
    template = template.replace(
      'this is reset password link',
      `${config.origin}/forget-password?token=${token}`,
    );

    // Sending reset password  mail
    await sendMail(emailAddress, 'Reset your password', template);
  } catch (error) {
    throw new AppError(400, 'Something went wrong');
  }
};
