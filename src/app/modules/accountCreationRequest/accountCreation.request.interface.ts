import { TUser } from "../user/user.interface";


export type TAccountCreationRequest = Pick<TUser,'name'|'email'|'role'> & {password:string,otp:string,createdAt:Date,updatedAt:Date}
