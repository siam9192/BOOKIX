"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const zod_1 = require("zod");
const category_controller_1 = require("./category.controller");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_interface_1.TRole.CUSTOMER, user_interface_1.TRole.ADMIN, user_interface_1.TRole.MODERATOR), (0, validateRequest_1.default)(zod_1.z.object({ name: zod_1.z.string(), image: zod_1.z.string() })), category_controller_1.CategoryController.createCategory);
router.get('/', category_controller_1.CategoryController.getCategories);
router.delete('/:categoryId', (0, auth_1.default)(user_interface_1.TRole.ADMIN, user_interface_1.TRole.MODERATOR), category_controller_1.CategoryController.deleteCategory);
exports.CategoryRouter = router;
