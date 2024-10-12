"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, default: null },
    link: { type: String, default: null },
    icon: { type: String, default: null },
});
exports.Notification = (0, mongoose_1.model)('Notification', notificationSchema);
