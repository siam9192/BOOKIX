import httpStatus from "http-status";
import AppError from "../../Errors/AppError";
import { TRegistrationOption, TUser } from "./user.interface";
import { User } from "./user.model";
import { bcryptHash } from "../../utils/bycrypt";

const createUserIntoDB = async(payload:TUser,registered_by: typeof TRegistrationOption[keyof typeof TRegistrationOption])=>{
    const user = await User.findOne({email:payload.email});
    // Checking user existence
    if(user){
        throw new AppError(httpStatus.NOT_ACCEPTABLE,'User already exists')
    }
    // Creating user account based on sign up type 
    switch (registered_by) {
        case TRegistrationOption.GOOGLE_AUTH:
            payload.registered_by =  TRegistrationOption.GOOGLE_AUTH
            break;
        case TRegistrationOption.EMAIL:
            if(!payload.password){
               throw new AppError(httpStatus.NOT_ACCEPTABLE,"Can't be accepted with out password")
            }

            payload.registered_by = TRegistrationOption.EMAIL

            // Creating user
            return await User.create(payload)
        default:
            break;
    }
}




const getUser = async (userId:string)=>{
const user = await User.findById(userId)

// If user found then return the user otherwise throw an user not found error
if(!user){
    throw new AppError(httpStatus.NOT_FOUND,'User not found')
}

return user

}


export const UserService = {
    createUserIntoDB,
    getUser
}