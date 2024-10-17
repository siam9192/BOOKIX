import { months } from '../../utils/constant';
import { objectId } from '../../utils/func';
import { TOrderStatus } from '../order/order.interface';
import { Order } from '../order/order.model';
import { Payment } from '../payment/payment.model';
import { Review } from '../review/review.model';
import { User } from '../user/user.model';
import {
  getAnalysisOfDay,
  getAnalysisOfMonth,
  getAnalysisOfYear,
} from './overview.function';
import { TAdminOverviewAnalysisQuery, TMilestoneQuery } from './overview.interface';

const getCustomerAccountOverViewFromDB = async (userId: string) => {
  const orders = await Order.find({ customer: objectId(userId) });
  const bookYetToReview = await Order.aggregate([
    {
      $match: {
        customer: objectId(userId),
        status: TOrderStatus.DELIVERED,
      },
    },
    {
      $unwind: '$items',
    },
    {
      $project: {
        order: '$items',
      },
    },
    {
      $match: {
        'order.is_reviewed': false,
      },
    },
  ]);
  const userWithNotifications =
    await User.findById(userId).select('notifications');

  const order_to_ship_count = orders.filter(
    (order) => order.status === TOrderStatus.IN_TRANSIT,
  ).length;
  const order_delivered_count = orders.filter(
    (order) => order.status === TOrderStatus.IN_TRANSIT,
  ).length;
  const book_to_review_count = bookYetToReview.length;

  const notification_count = userWithNotifications?.notifications.length || 0;
  return {
    order_to_ship_count,
    order_delivered_count,
    book_to_review_count,
    notification_count,
  };
};

const getAdminOverviewFromDB = () => {};
const getAdminOverviewAnalysisFromDB = async (
  query: TAdminOverviewAnalysisQuery,
) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  let year = currentYear;
  let month = currentMonth;
  let day: number | null = null;

  const queryYear = parseInt(query.year);
  const queryMonth = parseInt(query.month);
  const queryDay = parseInt(query.day);
  

  if (queryYear) {
    year = queryYear;
  }
  if (queryMonth) {
    month = queryMonth;
  }
  if (queryDay) {
    day = queryDay;
  }

  let result;
  if (year && !month) {
    result = await getAnalysisOfYear(year);
  } else if (month && !day) {
    result = await getAnalysisOfMonth(year, month);
  } else if (year && month && day) {
    result = await getAnalysisOfDay(year, month, day);
  }

  return result;
};

const getAdminOverViewDataFromDB = async () => {
  const orders = await Order.find().countDocuments();
  const reviews = await Review.find().countDocuments();
  const users = await User.find().countDocuments();
  const revenues = await Payment.find().countDocuments();

  return {
    orders,
    revenues,
    reviews,
    users,
  };
};

const getAdminOverviewMilestonesFromDB = async (query:TMilestoneQuery)=>{
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  const dayStartTime = new Date(currentYear,currentMonth, 1);
  dayStartTime.setHours(0, 0, 0, 0);
  const dayEndTime = new Date(currentYear,currentMonth+ 1, 0);
  dayEndTime.setHours(23, 59, 59, 999);

 
 const orderMilestone = 500
 const revenueMilestone = 2000
 const newUserMilestone = 1000
 const reviewMilestone = 200

 const orders = await Order.find({
  createdAt:{$gte:dayStartTime,$lte:dayEndTime}
 }).countDocuments()

 const revenues = await Payment.aggregate([
  {
    $match:{
      createdAt:{$gte:dayStartTime,$lte:dayEndTime}
     }
  },
 {
  $group:{
    _id:null,
    total:{
      $sum:'$amount.total'
    }
  }
 }
 ])
const users = await User.find({
  createdAt:{$gte:dayStartTime,$lte:dayEndTime}
 }).countDocuments()

 const reviews = await Review.find({
  createdAt:{$gte:dayStartTime,$lte:dayEndTime}
 }).countDocuments()

 const data = [
  {
    name:'orders',
    total:orders,
    milestone:orderMilestone
  },
  {
    name:'revenues',
    total:revenues[0]?.total||0,
    milestone:revenueMilestone
  },
  {
    name:'reviews',
    total:reviews,
    milestone:revenueMilestone
  },
  {
    name:'new users',
    total:users,
    milestone:newUserMilestone
  },
 ]
 
 return data.map(item=>({
  ...item,
  progress:(item.total/item.milestone)*100
 }))

}

export const OverviewService = {
  getCustomerAccountOverViewFromDB,
  getAdminOverviewFromDB,
  getAdminOverviewAnalysisFromDB,
  getAdminOverViewDataFromDB,
  getAdminOverviewMilestonesFromDB
};
