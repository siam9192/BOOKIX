"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverviewRouter = void 0;
const express_1 = require("express");
const user_interface_1 = require("../user/user.interface");
const overview_controller_1 = require("./overview.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.get('/customer', (0, auth_1.default)(user_interface_1.TRole.CUSTOMER), overview_controller_1.OverviewController.getCustomerAccountOverView);
exports.OverviewRouter = router;
