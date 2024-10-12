"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const QueryBuilder_1 = __importDefault(require("../../middlewares/QueryBuilder"));
const createUserIntoDB = (payload, registered_by) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email });
    // Checking user existence
    if (user) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'User already exists');
    }
    // Creating user account based on sign up type
    switch (registered_by) {
        case user_interface_1.TRegistrationOption.GOOGLE_AUTH:
            payload.registered_by = user_interface_1.TRegistrationOption.GOOGLE_AUTH;
            return yield user_model_1.User.create(payload);
            break;
        case user_interface_1.TRegistrationOption.EMAIL:
            if (!payload.password) {
                throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Can't be accepted with out password");
            }
            payload.registered_by = user_interface_1.TRegistrationOption.EMAIL;
            // Creating user
            return yield user_model_1.User.create(payload);
        default:
            break;
    }
});
const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    // If user found then return the user otherwise throw an user not found error
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return user;
});
const getUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield new QueryBuilder_1.default(user_model_1.User.find(), query).textSearch().get();
    return result;
});
const changeUserBlockStatusIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(payload.userId);
    // Checking user existence
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User Not found');
    }
    // Admin can not be block
    if (user.role === user_interface_1.TRole.ADMIN) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'It can not possible to block admin');
    }
    return yield user_model_1.User.findByIdAndUpdate(payload.userId, {
        is_blocked: payload.status,
    });
});
const changeUserRoleIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findByIdAndUpdate(payload.userId, { role: payload.role });
});
exports.UserService = {
    createUserIntoDB,
    getUser,
    getUsers,
    changeUserBlockStatusIntoDB,
    changeUserRoleIntoDB,
};
