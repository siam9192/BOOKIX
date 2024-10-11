import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { OverviewService } from './overview.service';

const getCustomerAccountOverView= catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await OverviewService.getCustomerAccountOverViewFromDB(userId);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Customer account overview data retrieved successfully',
      data: result,
    });
  });


export const OverviewController  =  {
    getCustomerAccountOverView
}