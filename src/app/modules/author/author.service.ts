import httpStatus from "http-status";
import AppError from "../../Errors/AppError";
import QueryBuilder from "../../middlewares/QueryBuilder";
import { TAuthor } from "./author.interface";
import { Author } from "./author.model";

const createAuthorIntoDB = async (payload:TAuthor)=>{
    return await Author.create(payload)
}


const getAuthorFromDB = async(authorId:string)=>{
    return Author.findById(authorId)
}


const getAuthorsFromDB = async(name:string)=>{
    const query = {
        searchTerm:name
    }
    const result = await new QueryBuilder(Author.find(),query).textSearch().get()
    return result
}

const updateAuthorIntoDB = async(authorId:string,payload:Partial<TAuthor>)=>{
  const author = await Author.findById(authorId)

// Checking author existence
  if(!author){
    throw new AppError(httpStatus.NOT_FOUND,'Author not found')
  }
//   Updating author details
  return await Author.findByIdAndUpdate(authorId,payload,{new:true,runValidators:true})
}

const deleteAuthorFromDB = async (authorId:string)=>{
    const author = await Author.findById(authorId)

    // Checking author existence
      if(!author){
        throw new AppError(httpStatus.NOT_FOUND,'Author not found')
      }
      return await Author.findByIdAndDelete(authorId,{new:true})
}


export const  AuthorService = {
    createAuthorIntoDB,
    getAuthorFromDB,
    getAuthorsFromDB,
    updateAuthorIntoDB,
    deleteAuthorFromDB
}