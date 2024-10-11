import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { TAccountCreationRequest } from '../accountCreationRequest/accountCreation.request.interface';
import { AccountCreationRequestService } from '../accountCreationRequest/accountCreation.request.service';
import { TRegistrationOption, TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TSignInPayload } from './auth.interface';
import { bcryptCompare, bcryptHash } from '../../utils/bycrypt';
import { generateJwtToken, verifyToken } from '../../utils/func';
import config from '../../config';
import { UserService } from '../user/user.service';
import { sendResetPasswordMail } from '../../utils/sendEmail';
import { JwtPayload } from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const googleCallback = async ({
  accessToken: googleAccessToken,
}: {
  accessToken: string;
}) => {
  try {
    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      },
    );

    let tokenPayload;

    const user = await User.findOne({ email: data.email });

    // Checking user existence if user found then generate refresh token and access token otherwise create a user and then  generate refresh token and access token
    if (user) {
      tokenPayload = {
        id: user._id,
        role: user.role,
      };
    } else {
      const userData = {
        email: data.email,
        google_id: data.id,
        registered_by: TRegistrationOption.GOOGLE_AUTH,
      };
      const user = await User.create(userData);

      tokenPayload = {
        id: user.id,
        role: user.role,
      };
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
  } catch (error) {
    throw new AppError(400, 'Something went wrong');
  }
};

const googleCallback1 = async (payload: TUser) => {
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
  const isMatched = await bcryptCompare(payload.password, user.password!);

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

const changePasswordIntoDB = async (
  userId: string,
  payload: { current_password: string; new_password: string },
) => {
  const user = await User.findById(userId).select('password');

  // Checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const matchPassword = bcryptCompare(
    payload.current_password,
    user?.password!,
  );
  if (!matchPassword) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'You entered wrong current password',
    );
  }

  // Hashed new password using bcrypt
  const hashedNewPassword = await bcryptHash(payload.new_password);

  const result = await User.updateOne(
    { _id: user._id },
    { password: hashedNewPassword },
  );

  // Checking is the password updated successfully
  if (!result.modifiedCount) {
    throw new AppError(400, 'Password could not be changed');
  }

  return true;
};

const forgetPassword = async (email: string) => {
  const user = await User.findOne({
    email: email,
    registered_by: TRegistrationOption.EMAIL,
  });

  // Checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'No account found on this email');
  }

  const payload = {
    email: user.email,
  };

  const token = generateJwtToken(
    payload,
    config.jwt_forget_password_token_secret as string,
    config.jwt_forget_password_token_expire_time as string,
  );
  await sendResetPasswordMail(user.email, token);
};

const resetPasswordFromForgetPasswordRequest = async (payload: {
  token: string;
  new_password: string;
}) => {
  const decode: any = verifyToken(
    payload.token,
    config.jwt_forget_password_token_secret as string,
  );
  if (!decode) {
    throw new AppError(400, 'Something went  wrong');
  }

  const user = await User.findOne({
    email: decode.email,
    registered_by: TRegistrationOption.EMAIL,
  });

  // Checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not found');
  }

  // Hashed new  password
  const hashedNewPassword = await bcryptHash(payload.new_password);

  const updatePassword = await User.updateOne(
    { email: user.email },
    { password: hashedNewPassword },
  );

  if (!updatePassword.modifiedCount) {
    throw new AppError(
      400,
      'Password can not be changed some thing went wrong!',
    );
  }
};

const getAccessTokenByRefreshToken = async (
  userId: string,
  refreshToken: string,
) => {
  try {
    const decode = verifyToken(
      refreshToken,
      config.jwt_refresh_token_secret as string,
    ) as JwtPayload & { id: string; role: string };
    if (!decode) {
      throw new Error();
    }

    if (userId !== decode.id) {
      throw new Error();
    }
    const user = await User.findById(decode.id);
    if (!user) {
      throw new Error();
    }

    const tokenPayload = {
      id: user._id,
      role: user.role,
    };

    // Generating access token
    const accessToken = generateJwtToken(
      tokenPayload,
      config.jwt_access_secret as string,
      '30d',
    );
    return {
      accessToken,
    };
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized!');
  }
};

export const AuthService = {
  googleCallback,
  signUpRequest,
  signUpVerify,
  resendOtp,
  login,
  changePasswordIntoDB,
  forgetPassword,
  resetPasswordFromForgetPasswordRequest,
  getAccessTokenByRefreshToken,
};
