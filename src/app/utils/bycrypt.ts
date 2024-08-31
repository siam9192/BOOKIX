import bcrypt from 'bcrypt';
import config from '../config';

export const bcryptHash = async(data:string)=>{
    return await bcrypt.hash(data,Number(config.bcrypt_salt_rounds as string))
}

export const bcryptCompare = async (data:string,hashedData:string)=>{
   return await bcrypt.compare(data,hashedData)
}