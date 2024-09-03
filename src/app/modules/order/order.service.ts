import httpStatus from "http-status"
import AppError from "../../Errors/AppError"
import { objectId } from "../../utils/func"
import { Book } from "../book/book.model"
import {  TPaymentMethodUnion } from "../payment/payment.interface"
import { Stripe } from "../../paymentMethods/stripe"
import { Order } from "./order.model"
import { Payment } from "../payment/payment.model"
import {v4 as uuidv4} from 'uuid'
import crypto from 'crypto';
import { startSession } from "mongoose"
import { TDeliveryDetails } from "./order.interface"



const createOrderIntoDB =async(userId:string,payload:{books:{bookId:string,quantity:number}[],delivery_details:TDeliveryDetails,coupon?:string,payment_method:TPaymentMethodUnion,})=>{
const bookObjectIds = payload.books.map(book=>objectId(book.bookId))
 const  books = await Book.find({_id:{$in:bookObjectIds}})
 
//  Checking is get all books correctly 
 if(books.length !== payload.books.length){
   throw new AppError(httpStatus.NOT_FOUND,'Book not found')
 }
 

 const purchasedBooks:any[] = []

 payload.books.forEach((book)=>{
   const foundedBook = books.find(dbBook=>dbBook._id.toString() === book.bookId)
   
   if(!foundedBook){
    throw new AppError(httpStatus.NOT_FOUND,`Book not found`)
   }

   // Checking is user demanded number of quantity books available in stock 

   else if(foundedBook.available_stock < book.quantity ){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'Stock not available')
   }

   else if(foundedBook.is_paused || foundedBook.is_deleted){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,`Currently ${foundedBook.name} is not available to purchase`)
   }
   const bookData = {
    book:foundedBook._id,
    name:foundedBook.name,
    image:foundedBook.cover_images[0],
    quantity:book.quantity,
    unit_price:foundedBook.price.enable_discount_price ?foundedBook.price.discount_price:foundedBook.price,
    free_delivery:foundedBook.free_delivery||false
   }
  purchasedBooks.push(bookData)
     
 })

 
 
   
  let  success_url;
  let cancel_url = 'http://localhost:5173/'
 
  
  // Calculating total amount 
  let total = 0;
  let subtotal = 0;
  let delivery_charge = 0

  purchasedBooks.forEach(item=>{
      total += item.unit_price*item.quantity
      subtotal += item.unit_price*item.quantity
      // Checking is the book has free delivery service 
      if(!item.free_delivery){
        total +=3
        delivery_charge+=3
      }
  })
    
  const amount = {
    subtotal,
    delivery_charge,
    total
  }

  const paymentData = {
    transaction_id:'ST'+crypto.randomBytes(8).toString('hex'),
    payment_method:payload.payment_method,
    intent_id:crypto.randomBytes(8).toString('hex'),
    amount,
    coupon:payload.coupon||null,
    user:userId
  }
   
  
  
  const session = await startSession()
  session.startTransaction()
  try {
    const payment = await Payment.create([paymentData],{session:session})
    if(!payment||!payment[0]){
    throw new Error()
    }
 
    success_url = `http://localhost:5000/api/v1/orders/payment-success?paymentId=${payment[0]._id.toString()}`
  await Promise.all(
      [
        ...purchasedBooks.map((book)=> Order.create({
          book:book.book,
          quantity:book.quantity,
          unit_price:book.unit_price,
          delivery_details:payload.delivery_details,
          payment:payment[0]._id,
          user:userId
        }))
      ]
   )
  .then()
  .catch(err=>{
    throw new Error()
  })
  
 
  const url = (await Stripe.pay({
    books:purchasedBooks,
    success_url,
    cancel_url
  })).url
  if(!url){
    throw new Error()
  }

 await session.commitTransaction()
 await session.endSession()
 return url
  } catch (error) {
   
 await  session.abortTransaction()
 await  session.endSession()  
 throw new AppError(400,"Something went wrong")
  }
  
}


const managePaymentSuccessOrdersIntoDB = async (paymentId:string)=>{
 const payment = await Payment.findById(paymentId)

 if(!payment){
  throw new AppError(httpStatus.NOT_FOUND,'Something went wrong')
 }

 const updatePayment = await Payment.updateOne({_id:payment._id},{success:true})
 if(!updatePayment.modifiedCount){
  throw new AppError(400,'Order unsuccess full')
 }
const orders = await Order.find({payment:objectId(paymentId)})

Promise.all(orders.map(order=>{
 return Book.findByIdAndUpdate(order.book.toString(),{quantity:{$inc:-order.quantity}})
}))
.then(values=>{
  
})
return true
}

const getOrders = async(query:any)=>{
  const result = await Order.aggregate([
    
  ])
}


export const OrderService = {
  createOrderIntoDB,
  managePaymentSuccessOrdersIntoDB
}