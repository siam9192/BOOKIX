import { hours, months } from '../../utils/constant';
import { getDaysInMonth } from '../../utils/func';
import { Order } from '../order/order.model';
import { Payment } from '../payment/payment.model';
import { Review } from '../review/review.model';

export const getAnalysisOfYear = async (year: number) => {
  const yearFirstDate = new Date(year, 0, 1);
  const yearLastDate = new Date(year, 12, 31);
  const orders = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: yearFirstDate,
          $lte: yearLastDate,
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  const revenues = await Payment.aggregate([
    {
      $match: {
        createdAt: {
          $gte: yearFirstDate,
          $lte: yearLastDate,
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        total: {
          $sum: '$amount.total',
        },
      },
    },
  ]);

  const users = await Payment.aggregate([
    {
      $match: {
        createdAt: {
          $gte: yearFirstDate,
          $lte: yearLastDate,
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  const reviews = await Review.aggregate([
    {
      $match: {
        createdAt: {
          $gte: yearFirstDate,
          $lte: yearLastDate,
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  const result = months.map((month, index) => {
    const monthNumber = index;

    let revenue = 0;
    let order = 0;
    let user = 0;
    let review = 0;

    revenues.forEach((item) => {
      if (item._id - 1 === monthNumber) revenue = item.total;
    });
    orders.forEach((item) => {
      if (item._id - 1 === monthNumber) order = item.total;
    });
    users.forEach((item) => {
      if (item._id - 1 === monthNumber) user = item.total;
    });

    reviews.forEach((item) => {
      if (item._id - 1 === monthNumber) review = item.total;
    });

    return {
      type: 'month',
      year: year,
      month: month,
      order,
      revenue,
      review,
      user,
    };
  });
  return result;
};

export const getAnalysisOfMonth = async (year: number, month: number) => {
  const monthFirstDate = new Date(year, month, 1);
  const monthLastDate = new Date(year, month + 1, 0);
  const monthDays = getDaysInMonth(year, month).map((date) => date.getDate());
  const orders = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: monthFirstDate,
          $lte: monthLastDate,
        },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: '$createdAt' },
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  const revenues = await Payment.aggregate([
    {
      $match: {
        createdAt: {
          $gte: monthFirstDate,
          $lte: monthLastDate,
        },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: '$createdAt' },
        total: {
          $sum: '$amount.total',
        },
      },
    },
  ]);

  const users = await Payment.aggregate([
    {
      $match: {
        createdAt: {
          $gte: monthFirstDate,
          $lte: monthLastDate,
        },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: '$createdAt' },
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  const reviews = await Review.aggregate([
    {
      $match: {
        createdAt: {
          $gte: monthFirstDate,
          $lte: monthLastDate,
        },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: '$createdAt' },
        total: {
          $sum: 1,
        },
      },
    },
  ]);
  
 

  const result = monthDays.map((day, index) => {
    let revenue = 0;
    let order = 0;
    let user = 0;
    let review = 0;

    orders.forEach((item) => {
      if (item._id === day) order = item.total;
    });
    revenues.forEach((item) => {
      if (item._id === day) revenue = item.total;
    });

    reviews.forEach((item) => {
      if (item._id === day) review = item.total;
    });

    users.forEach((item) => {
      if (item._id === day) user = item.total;
    });

    return {
      type: 'month',
      year: year,
      month: months[month],
      day,
      order,
      revenue,
      review,
      user,
    };
  });
  return result;
};

export const getAnalysisOfDay = async (
  year: number,
  month: number,
  day: number,
) => {
  const dayStartTime = new Date(year, month, 1);
  dayStartTime.setHours(0, 0, 0, 0);
  const dayEndTime = new Date(year, month + 1, 0);
  dayEndTime.setHours(23, 59, 59, 999);

  const orders = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: dayStartTime,
          $lte: dayEndTime,
        },
      },
    },
    {
      $group: {
        _id: { $hour: '$createdAt' },
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  const revenues = await Payment.aggregate([
    {
      $match: {
        createdAt: {
          $gte: dayStartTime,
          $lte: dayEndTime,
        },
      },
    },
    {
      $group: {
        _id: { $hour: '$createdAt' },
        total: {
          $sum: '$amount.total',
        },
      },
    },
  ]);

  const users = await Payment.aggregate([
    {
      $match: {
        createdAt: {
          $gte: dayStartTime,
          $lte: dayEndTime,
        },
      },
    },
    {
      $group: {
        _id: { $hour: '$createdAt' },
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  const reviews = await Review.aggregate([
    {
      $match: {
        createdAt: {
          $gte: dayStartTime,
          $lte: dayEndTime,
        },
      },
    },
    {
      $group: {
        _id: { $hour: '$createdAt' },
        total: {
          $sum: 1,
        },
      },
    },
  ]);

  const result = hours.map((hour) => {
    let revenue = 0;
    let order = 0;
    let user = 0;
    let review = 0;

    orders.forEach((item) => {
      if (item._id === hour) order = item.total;
    });
    revenues.forEach((item) => {
      if (item._id === hour) revenue = item.total;
    });

    reviews.forEach((item) => {
      if (item._id === hour) review = item.total;
    });

    users.forEach((item) => {
      if (item._id === hour) user = item.total;
    });

    return {
      type: 'day',
      year: year,
      month: months[month],
      day,
      hour,
      order,
      revenue,
      review,
      user,
    };
  });
  
  return result;
};
