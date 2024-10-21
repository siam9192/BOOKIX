import { Types } from 'mongoose';

export type TName = {
  first_name: string;
  middle_name?: string;
  last_name?: string;
};

export enum TGender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum BrowserFamily {
  Chrome = 'Chrome',
  Firefox = 'Firefox',
  Safari = 'Safari',
  Edge = 'Edge',
  Opera = 'Opera',
  InternetExplorer = 'Internet Explorer',
  Other = 'Other',
}

export type TDevice = {
  family: keyof typeof BrowserFamily;
  major: string;
  minor: string;
  patch: string;
  os: string;
  device: string;
};

export type TLogInDevice = {
  device: TDevice;
  log_in_date: Date;
};

export enum TRole {
  CUSTOMER = 'Customer',
  MODERATOR = 'Moderator',
  ADMIN = 'Admin',
}
export type TRoleUnion = (typeof TRole)[keyof typeof TRole];

export enum TRegistrationOption {
  GOOGLE_AUTH = 'google_auth',
  EMAIL = 'email',
}

type TNotification = {
  notification: Types.ObjectId;
  read: boolean;
  created_at: Date;
};

export type TUser = {
  name: TName;
  date_of_birth: string;
  gender: (typeof TGender)[keyof typeof TGender];
  profile_photo: string;
  google_id?: string;
  email: string;
  password?: string;
  role: (typeof TRole)[keyof typeof TRole];
  is_blocked?: boolean;
  is_deleted?: boolean;
  registered_by: (typeof TRegistrationOption)[keyof typeof TRegistrationOption];
  notifications: TNotification[];
  createdAt: Date;
};
