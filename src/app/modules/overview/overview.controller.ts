import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { OverviewService } from './overview.service';
import { TAdminOverviewAnalysisQuery } from './overview.interface';

const getCustomerAccountOverView = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result =
      await OverviewService.getCustomerAccountOverViewFromDB(userId);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Customer account overview data retrieved successfully',
      data: result,
    });
  },
);

const getAdminOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await OverviewService.getAdminOverviewFromDB();
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Admin Dashboard overview data retrieved successfully',
    data: result,
  });
});

const getAdminOverviewAnalysis = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OverviewService.getAdminOverviewAnalysisFromDB(
      req.query as TAdminOverviewAnalysisQuery,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Admin Dashboard overview analysis data retrieved successfully',
      data: result,
    });
  },
);

const getAdminOverviewData = catchAsync(async (req: Request, res: Response) => {
  const result = await OverviewService.getAdminOverViewDataFromDB();
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Admin Dashboard overview  data retrieved successfully',
    data: result,
  });
});

const getAdminOverviewMilestones = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OverviewService.getAdminOverviewMilestonesFromDB(
      req.query as any,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Admin Dashboard overview  data retrieved successfully',
      data: result,
    });
  },
);

export const OverviewController = {
  getCustomerAccountOverView,
  getAdminOverview,
  getAdminOverviewAnalysis,
  getAdminOverviewData,
  getAdminOverviewMilestones,
};
