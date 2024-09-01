import httpStatus from "http-status"
import catchAsync from "../../utils/catchAsync"
import { sendSuccessResponse } from "../../utils/response"
import { Request, Response } from "express"
import { CartService } from "./cart.service"

const createCart = catchAsync(async(req:Request,res:Response)=>{
    const userId = req.user.id
    const result = await CartService.createCartItemIntoDB(userId,req.body)
    sendSuccessResponse(res,{
       statusCode:httpStatus.CREATED,
       message:'Cart item creates successfully successfully',
       data:result
    })
   })


const getCartItems = catchAsync(async(req:Request,res:Response)=>{
    const userId = req.user.id
    const result = await CartService.getCartItemsFromDB(userId)
    sendSuccessResponse(res,{
       statusCode:httpStatus.CREATED,
       message:'Cart items retrieved successfully successfully',
       data:result
    })
   })


const updateCartItemQuantity = catchAsync(async(req:Request,res:Response)=>{
    const userId = req.user.id
    const result = await CartService.updateCartItemQuantityIntoDB(userId,req.body)
    sendSuccessResponse(res,{
       statusCode:httpStatus.CREATED,
       message:'Cart item quantity updated successfully successfully',
       data:result
    })
   })

const deleteCartItem = catchAsync(async(req:Request,res:Response)=>{
    const userId = req.user.id
    const cartItemId = req.params.itemId
    const result = await CartService.deleteCartItemFromDB(userId,cartItemId)
    sendSuccessResponse(res,{
       statusCode:httpStatus.CREATED,
       message:'Cart deleted successfully successfully',
       data:result
    })
   })

const deleteMultipleCartItems = catchAsync(async(req:Request,res:Response)=>{
    const cartItemIds = req.body.itemIds
    const result = await CartService.getCartItemsFromDB(cartItemIds)
    sendSuccessResponse(res,{
       statusCode:httpStatus.CREATED,
       message:'Cart items deleted successfully successfully',
       data:result
    })
   })


export const cartController = {
    createCart,
    getCartItems,
    updateCartItemQuantity,
    deleteCartItem,
    deleteMultipleCartItems
}