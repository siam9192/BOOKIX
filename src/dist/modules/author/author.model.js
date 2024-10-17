'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Author = void 0;
const mongoose_1 = require('mongoose');
const authorSchema = new mongoose_1.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    biography: {
      type: String,
      minlength: 20,
      required: true,
    },
    birth_date: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
authorSchema.index({ name: 'text' });
exports.Author = (0, mongoose_1.model)('Author', authorSchema);
