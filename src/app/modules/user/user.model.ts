import mongoose, { Schema, Document } from 'mongoose';
import { TGender, TName, TRegistrationOption, TRole } from './user.interface';

export const nameSchema = new Schema<TName>({
  first_name: {
    type: String,
    required: true,
  },
  middle_name: {
    type: String,
    default: null,
  },
  last_name: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema({
  name: {
    type: nameSchema,
    required: true,
  },
  date_of_birth: {
    type: String,
    default:null,
  },
  gender: {
    type: String,
    enum: Object.values(TGender),
    default:null
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    select:0,
    default: null,
  },
  role: {
    type: String,
    enum: Object.values(TRole),
    required: true,
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  registered_by: {
    type: String,
    enum: Object.values(TRegistrationOption),
    required: true,
  },
},{
    timestamps:true
});

export const User = mongoose.model('User', userSchema);
