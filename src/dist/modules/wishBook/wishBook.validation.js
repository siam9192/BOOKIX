'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.WiseBookValidations = void 0;
const zod_1 = require('zod');
const createWiseBookValidation = zod_1.z.object({
  bookId: zod_1.z.string(),
});
exports.WiseBookValidations = {
  createWiseBookValidation,
};
