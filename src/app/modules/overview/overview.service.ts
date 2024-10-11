import { objectId } from "../../utils/func"
import { TOrderStatus } from "../order/order.interface"
import { Order } from "../order/order.model"
import { User } from "../user/user.model"

const getCustomerAccountOverViewFromDB = async (userId:string)=>{
    const orders = await Order.find({customer:objectId(userId)})
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
    ])
    const userWithNotifications = await User.findById(userId).select('notifications')

    const order_to_ship_count = orders.filter(order=>order.status === TOrderStatus.IN_TRANSIT).length
    const order_delivered_count = orders.filter(order=>order.status === TOrderStatus.IN_TRANSIT).length
    const book_to_review_count = bookYetToReview.length
    
    const notification_count = userWithNotifications?.notifications.length||0
    return {
       order_to_ship_count,
       order_delivered_count,
       book_to_review_count,
       notification_count
    }
   }

   
   
   export const OverviewService = {
       getCustomerAccountOverViewFromDB
   }