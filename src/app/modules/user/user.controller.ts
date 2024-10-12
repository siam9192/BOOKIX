import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { sendSuccessResponse } from '../../utils/response';
import catchAsync from '../../utils/catchAsync';

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUsers(req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully',
    data: result,
  });
});
const getUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUser(req.params.userId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id
  const result = await UserService.getUser(userId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User retrieved successfully',
    data: result,
  });
});


const changeUserBlockStatusIntoDB = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.changeUserBlockStatusIntoDB(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'User block status changed successfully successfully',
      data: result,
    });
  },
);

const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.changeUserRoleIntoDB(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User role changed successfully successfully',
    data: result,
  });
});

export const UserController = {
  getUsers,
  getUser,
  changeUserBlockStatusIntoDB,
  changeUserRole,
  getCurrentUser
};
