import httpStatus from "http-status"
import AppError from "../../Errors/AppError"
import { objectId } from "../../utils/func"
import { Book } from "../book/book.model"

const createOrderIntoDB =async(userId:string,payload:{books:{bookId:string,quantity:number}[],coupon:string})=>{

const bookObjectIds = payload.books.map(book=>objectId(book.bookId))
 const  books = await Book.find({_id:{$in:bookObjectIds}})
 
//  Checking is get all books correctly 
 if(books.length !== payload.books.length){
   throw new AppError(httpStatus.NOT_FOUND,'Book not found')
 }
 
 const payloadBooks = payload.books
 const purchasedBooks:any = []

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

  




   

 })
}