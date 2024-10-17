'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const dotenv_1 = __importDefault(require('dotenv'));
const path_1 = __importDefault(require('path'));
dotenv_1.default.config({ path: path_1.default.join((process.cwd(), '.env')) });
exports.default = {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  origin: process.env.ORIGIN,
  backend_base_api: process.env.BACKEND_BASE_API,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_token_expire_time: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
  jwt_refresh_token_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_token_expire_time: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
  jwt_forget_password_token_secret: process.env.JWT_FORGET_PASSWORD_SECRET,
  jwt_forget_password_token_expire_time:
    process.env.JWT_FORGET_PASSWORD_SECRET_TOKEN_EXPIRE_TIME,
  jwt_ac_verify_secret: process.env.JWT_AC_VERIFY_SECRET,
  app_user_name: process.env.APP_USER_NAME,
  app_pass_key: process.env.APP_PASS_KEY,
  stripe_secret: process.env.STRIPE_SECRET,
  ssl_store_id: process.env.SSL_STORE_ID,
  ssl_store_password: process.env.SSL_STORE_PASSWORD,
  paypal_id: process.env.PAYPAL_ID,
  paypal_secret: process.env.PAYPAL_SECRET,
  payment_success_url: process.env.PAYMENT_SUCCESS_URL,
  payment_cancel_url: process.env.PAYMENT_CANCEL_URL,
  order_success_url: process.env.ORDER_SUCCESS_URL,
  order_cancel_url: process.env.ORDER_CANCEL_URL,
  payment_success_redirect_url: process.env.PAYMENT_SUCCESS_REDIRECT_URL,
};
