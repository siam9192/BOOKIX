import { model, Schema } from "mongoose";
import { TCart } from "./cart.interface";

const cartSchema = new Schema<TCart>({
    book:{
        type:Schema.Types.ObjectId,
        required:true
    },
    quantity:{
        type:Number,
        min:1,
        required:true
    }
},{
    timestamps:true
})


export const Cart = model<TCart>('Cart',cartSchema)