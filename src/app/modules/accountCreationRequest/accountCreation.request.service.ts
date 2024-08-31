import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { User } from '../user/user.model';
import {
  generateJwtToken,
  generateOTP,
  verifyToken,
} from '../../utils/func';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import { bcryptCompare, bcryptHash } from '../../utils/bycrypt';
import { TAccountCreationRequest } from './accountCreation.request.interface';
import { AccountCreationRequest } from './accountCreation.request.model';
import { sendEmailVerificationMail } from '../../utils/sendEmail';
import { startSession, Types } from 'mongoose';
import { UserService } from '../user/user.service';

const initiateAccountCreation = async (payload: TAccountCreationRequest) => {
  const user = await User.findOne({ email: payload.email });
  
  // Checking user existence
  if (user) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'User is already exists on this email',
    );
  }

   // Hashing password to secure it 
  payload.password = await bcryptHash(payload.password)

  // Generating otp 
  const otp = generateOTP(6);
  
  // Hashing otp to secure it 
  payload.otp = await bcryptHash(otp)


  // Saving account details minimum for 5 minute
  const result = await AccountCreationRequest.create(payload);
  
  // after successfully saving the details sending the verification mail to the user given email
  if (result) {
    await sendEmailVerificationMail(payload.email,otp);
  }

  const tokenPayload = {
    id:result._id,
    email: payload.email
  };

  // Generating jwt token for verify otp code 
  const token = generateJwtToken(
    tokenPayload,
    config.jwt_ac_verify_secret as string,
    '10m',
  );

  return {
    secret: token,
  };
};

const verifyOtpFromDB = async (payload: { secret: string; otp: string }) => {

  // Decoding jwt token
  const decode = verifyToken(
    payload.secret,
    config.jwt_ac_verify_secret as string,
  ) as JwtPayload;
  if (!decode) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Invalid request');
  }

  // Finding data
  const data = await AccountCreationRequest.findOne({_id:new Types.ObjectId(decode.id),email: decode.email });
  
  if(!data){
    throw new AppError(400,'Something went wrong')
  }
  const verifyOtp = await bcryptCompare(payload.otp,data.otp)
  
  // Verifying otp 
  if(!verifyOtp){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'Wrong otp')
  }
  
  const session = await startSession()
  session.startTransaction()

  const userData:any = {
    name:data.email,
    email:data.email,
    password:data.password,
    role:data.role
  }
  
  // Creating user after successfully verified
  const createdUser =  await UserService.createUserIntoDB(userData,'EMAIL')

  // Deleting account request data
  await  AccountCreationRequest.deleteOne({_id:new Types.ObjectId(data._id),email:data.email},{session})
  
  //When user creation is unsuccessful then 
  if(!createdUser){
    session.abortTransaction()
  }
   
  else {
    session.commitTransaction()
    return createdUser
  }
  
  session.endSession()
  throw new AppError(400,'Something went wrong')
   
};


const resendOtp =  async (payload:{secret:string,requestTime:string})=>{
   // Decoding jwt token
  const decode = verifyToken(
    payload.secret,
    config.jwt_ac_verify_secret as string,
  ) as JwtPayload;
  if (!decode) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Invalid request');
  }
 
  const accountCreationRequest = await AccountCreationRequest.findOne({_id:new Types.ObjectId(decode.id),email:decode.email})

  // Checking request existence
  if(!accountCreationRequest){
    throw new AppError(httpStatus.NOT_FOUND,"Something went wrong")
  }
  
  // Difference between request time and previous otp send time 
  const difference = (new Date(payload.requestTime||new Date()).valueOf() -  new Date(accountCreationRequest.updatedAt).valueOf())/1000 
  
  // If difference getter  than 120 seconds  than i  resend otp can not be possible
  if(difference<120){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,"Can not be able to resend otp before 2 minutes ")
  }

  // Generating new otp code
  const newOtp  = await bcryptHash(generateOTP(6))
  
  // Hashing otp
  const hashedOtp = await bcryptHash(newOtp)
  // Updating otp 
  const updatedAccountCreationRequest = await AccountCreationRequest.findOneAndUpdate({_id:new Types.ObjectId(decode.id),email:decode.email},{otp:newOtp},{new:true,runValidators:true})
  
  // Checking is otp updated successfully
  if(!updatedAccountCreationRequest){
    throw new AppError(400,"Something went wrong please try again")
  }

  await sendEmailVerificationMail(updatedAccountCreationRequest.email,newOtp)
  return true
}

export const AccountCreationRequestService = {
  initiateAccountCreation,
  verifyOtpFromDB,
  resendOtp
};
