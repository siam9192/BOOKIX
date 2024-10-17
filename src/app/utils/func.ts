import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

export function generateOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }
  return otp;
}

export const generateJwtToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const objectId = (id: string) => new Types.ObjectId(id);

export function getDaysInMonth(year: number, month: number) {
  // Month is zero-indexed (0 = January, 1 = February, ..., 11 = December)
  const days = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    days.push(new Date(date)); // Add the current day
    date.setDate(date.getDate() + 1); // Move to the next day
  }

  return days;
}
