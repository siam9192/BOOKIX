"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidations = void 0;
const zod_1 = require("zod");
const createReviewValidation = zod_1.z.object({
    order: zod_1.z.string(),
    book: zod_1.z.string(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    comment: zod_1.z.string(),
    rating: zod_1.z.number().max(5),
});
const reviewUpdateValidation = createReviewValidation.partial();
exports.reviewValidations = {
    createReviewValidation,
    reviewUpdateValidation,
};
