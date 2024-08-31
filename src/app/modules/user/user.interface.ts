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
export enum TRegistrationOption {
  GOOGLE_AUTH = 'google_auth',
  EMAIL = 'email',
}

export type TUser = {
  name: TName;
  date_of_birth: string;
  gender: keyof typeof TGender;
  email: string;
  password?: string;
  role: keyof typeof TRole;
  is_blocked?: boolean;
  isDeleted?: boolean;
  registered_by: keyof typeof TRegistrationOption;
};
