"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    is_hidden: {
        type: Boolean,
        default: false,
    },
});
exports.Category = (0, mongoose_1.model)('Category', CategorySchema);
