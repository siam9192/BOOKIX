import { model, Schema } from "mongoose";
import { TCart } from "./cart.interface";

const cartSchema = new Schema<TCart>({
    book:{
        type:Schema.Types.ObjectId,
        ref:'Book',
        required:true
    },
    quantity:{
        type:Number,
        min:1,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{
    timestamps:true
})


export const Cart = model<TCart>('Cart',cartSchema)