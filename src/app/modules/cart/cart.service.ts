import httpStatus from "http-status";
import AppError from "../../Errors/AppError";
import { Book } from "../book/book.model";
import { TCart } from "./cart.interface";
import { Cart } from "./cart.model";
import { Types } from "mongoose";
import { objectId } from "../../utils/func";

const createCartItemIntoDB =async(userId:string,payload:TCart)=>{
 const book = await Book.findById(payload.book)
 
//  Checking book existence and is book deleted or paused 
 if(!book){
    throw new AppError(httpStatus.NOT_FOUND,'Book not found')
 }
 else if(book.is_deleted || book.is_paused){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'This Book can not be add to cart')
 }

 const cartItem = await Cart.findOne({book:book._id,user:objectId(userId)})

//  Checking if this book already exists on cart
if(cartItem){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'This book already on your cart')
}


 payload.user = objectId(userId)
 
//  Creating cart
 const result = await Cart.create(payload)
 return result
}

const getCartItemsFromDB = async(userId:string)=>{
    return await Cart.find({user:objectId(userId)})
}

const updateCartItemQuantityIntoDB =  async(userId:string,payload:{itemId:string,quantity:number})=>{
    return await Cart.findOneAndUpdate({_id:objectId(payload.itemId),user:objectId(userId)},{quantity:payload.quantity})
}

const deleteCartItemFromDB = async(userId:string,cartItemId:string)=>{
    return await Cart.findOneAndDelete({_id:objectId(cartItemId),user:objectId(userId)})
}

const deleteMultipleCartItems = async(cartItemIds:string[])=>{
    const objectIds = cartItemIds.map(id=>objectId(id))
    return await Cart.deleteMany({_id:{$in:objectIds}})
}


export const CartService = {
    createCartItemIntoDB,
    getCartItemsFromDB,
    updateCartItemQuantityIntoDB,
    deleteCartItemFromDB,
    deleteMultipleCartItems
}