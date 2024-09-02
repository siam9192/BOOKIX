import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { TRegistrationOption, TRole, TUser } from './user.interface';
import { User } from './user.model';
import { bcryptHash } from '../../utils/bycrypt';
import QueryBuilder from '../../middlewares/QueryBuilder';

const createUserIntoDB = async (
  payload: TUser,
  registered_by: (typeof TRegistrationOption)[keyof typeof TRegistrationOption],
) => {
  const user = await User.findOne({ email: payload.email });
  // Checking user existence
  if (user) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'User already exists');
  }
  // Creating user account based on sign up type
  switch (registered_by) {
    case TRegistrationOption.GOOGLE_AUTH:
      payload.registered_by = TRegistrationOption.GOOGLE_AUTH;
      return await User.create(payload);
      break;
    case TRegistrationOption.EMAIL:
      if (!payload.password) {
        throw new AppError(
          httpStatus.NOT_ACCEPTABLE,
          "Can't be accepted with out password",
        );
      }

      payload.registered_by = TRegistrationOption.EMAIL;

      // Creating user
      return await User.create(payload);
    default:
      break;
  }
};

const getUser = async (userId: string) => {
  const user = await User.findById(userId);

  // If user found then return the user otherwise throw an user not found error
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

const getUsers = async(query:any)=>{
  const result = await new QueryBuilder(User.find(),query).textSearch().get()
  return result
}



const changeUserBlockStatusIntoDB = async (payload:{userId:string,status:boolean})=>{
  const user = await User.findById(payload.userId)
  
  // Checking user existence 
  if(!user){
    throw new AppError(httpStatus.NOT_FOUND,'User Not found')
  }
  
  // Admin can not be block 
  
  if(user.role === TRole.ADMIN){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'It can not possible to block admin')
  }

  return await User.findByIdAndUpdate(payload.userId,{is_blocked:payload.status})
}

const changeUserRoleIntoDB = async (userRole:string,payload:{userId:string,role:TRole})=>{

  // Moderator can not  change admin and moderator role
  if(userRole === TRole.MODERATOR && payload.role === TRole.ADMIN){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,"It can not possible by  Moderator to change admin role ")
  }
  else if(userRole === TRole.MODERATOR && payload.role === TRole.MODERATOR){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,"It can not possible by  Moderator to change Moderator role ")
  }

  return await User.findByIdAndUpdate(payload.userId,{role:payload.role})
}

export const UserService = {
  createUserIntoDB,
  getUser,
  getUsers,
  changeUserBlockStatusIntoDB,
  changeUserRoleIntoDB
};
