import httpStatus from "http-status";
import AppError from "../../Errors/AppError";
import QueryBuilder from "../../middlewares/QueryBuilder";
import { Payment } from "./payment.model"

const getPaymentsFromDB = async (query:any)=>{
 query.success = true;
 const result = await new QueryBuilder(Payment.find(),query).find().sort().paginate().get()
 const meta = await new QueryBuilder(Payment.find(),query).find().getMeta()
 return {
    result,
    meta
 };
}

const refundPayment = async (payload:{paymentId:string,amount?:number})=>{
    const payment = await Payment.findById(payload.paymentId)

    if(!payment){
        throw new AppError(httpStatus.NOT_FOUND,'Payment not found')
    }
    // Paypal.refund()
}


export const PaymentService = {
    getPaymentsFromDB
}