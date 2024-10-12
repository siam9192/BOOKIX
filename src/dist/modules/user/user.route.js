"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_interface_1 = require("./user.interface");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.default)(user_interface_1.TRole.ADMIN, user_interface_1.TRole.MODERATOR), user_controller_1.UserController.getUsers);
router.get('/:userId', (0, auth_1.default)(user_interface_1.TRole.ADMIN, user_interface_1.TRole.MODERATOR), user_controller_1.UserController.getUser);
// router.patch('//block')
router.patch('/change-role', (0, auth_1.default)(user_interface_1.TRole.ADMIN));
exports.UserRouter = router;
