"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishBook = void 0;
const mongoose_1 = require("mongoose");
const wishBookSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
exports.WishBook = (0, mongoose_1.model)('WishBook', wishBookSchema);
