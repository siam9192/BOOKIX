import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDB = (payload:TUser)=>{
 const user = User.findOne({email:payload.email})
 if(!user){
    // throw new 
 }
}