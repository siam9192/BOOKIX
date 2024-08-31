import { model, Schema } from 'mongoose';
import { nameSchema } from '../user/user.model';
import { TRole } from '../user/user.interface';
import { TAccountCreationRequest } from './accountCreation.request.interface';

const accountRequestSchema = new Schema<TAccountCreationRequest>(
  {
    name: {
      type: nameSchema,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(TRole),
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,

  },
);

accountRequestSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 180 });
export const AccountCreationRequest = model<TAccountCreationRequest>(
  'AccountCreationRequest',
  accountRequestSchema,
);
