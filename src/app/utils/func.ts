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

export const objectId = (id:string)=> new Types.ObjectId(id)


