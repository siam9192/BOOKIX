import mongoose, { Schema, Document } from 'mongoose';
import {
  TGender,
  TName,
  TRegistrationOption,
  TRole,
  TUser,
} from './user.interface';

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

const notificationSchema = new Schema({
  notification: {
    type: Schema.Types.ObjectId,
    ref: 'Notification',
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

const userSchema = new Schema<TUser>(
  {
    name: {
      type: nameSchema,
      required: true,
    },
    date_of_birth: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: Object.values(TGender),
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: 0,
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
    is_deleted: {
      type: Boolean,
      default: false,
    },
    registered_by: {
      type: String,
      enum: Object.values(TRegistrationOption),
      required: true,
    },
    notifications: {
      type: [notificationSchema],
      default: [],
      select: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model('User', userSchema);
