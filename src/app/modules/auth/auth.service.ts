import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { TAccountCreationRequest } from '../accountCreationRequest/accountCreation.request.interface';
import { AccountCreationRequestService } from '../accountCreationRequest/accountCreation.request.service';
import { TRegistrationOption, TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TSignInPayload } from './auth.interface';
import { bcryptCompare } from '../../utils/bycrypt';
import { generateJwtToken } from '../../utils/func';
import config from '../../config';
import { UserService } from '../user/user.service';

const googleCallback = async (payload: TUser) => {
  const user = await User.findOne({
    email: payload.email,
    registered_by: TRegistrationOption.GOOGLE_AUTH,
  });
  const tokenPayload = {
    id: user?._id,
    role: user?.role,
  };
  //  if user  not exist than create new user and finally return important tokens
  if (!user) {
    const user = await UserService.createUserIntoDB(
      payload,
      TRegistrationOption.GOOGLE_AUTH,
    );
    if (!user) {
      throw new AppError(400, 'Something went wrong');
    }
    tokenPayload.id = user?._id;
    tokenPayload.role = user?.role;
  }

  // Generating access token
  const accessToken = await generateJwtToken(
    tokenPayload,
    config.jwt_access_secret as string,
    '30d',
  );
  // Generating refresh token
  const refreshToken = await generateJwtToken(
    tokenPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expire_time as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

const signUpRequest = async (payload: TAccountCreationRequest) => {
  return await AccountCreationRequestService.initiateAccountCreation(payload);
};

const signUpVerify = async (payload: any) => {
  return await AccountCreationRequestService.verifyOtpFromDB(payload);
};

const resendOtp = async (payload: any) => {
  return await AccountCreationRequestService.resendOtp(payload);
};

const login = async (payload: TSignInPayload) => {
  const user = await User.findOne({ email: payload.email }).select([
    'password',
    'role',
  ]);

  // Checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Account not found');
  }

  // Comparing password
  const isMatched = await bcryptCompare(payload.password, user.password);

  // Checking is password correct
  if (!isMatched) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Wrong password');
  }

  const tokenPayload = {
    id: user._id,
    role: user.role,
  };

  // Generating access token
  const accessToken = await generateJwtToken(
    tokenPayload,
    config.jwt_access_secret as string,
    '30d',
  );
  // Generating refresh token
  const refreshToken = await generateJwtToken(
    tokenPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expire_time as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  signUpRequest,
  signUpVerify,
  resendOtp,
  login,
};
