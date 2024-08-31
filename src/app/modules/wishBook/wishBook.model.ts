import { model, Schema } from "mongoose";
import { TWishBook } from "./wishBook.interface";

const wishBookSchema = new Schema<TWishBook>({
    book:{
        type:Schema.Types.ObjectId,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        required:true
    }
},{
    timestamps:true
})

export const WishBook = model<TWishBook>('WishBook',wishBookSchema)