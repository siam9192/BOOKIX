"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorValidations = void 0;
const zod_1 = require("zod");
const createAuthorValidation = zod_1.z.object({
    name: zod_1.z.string().nonempty('Name is required'),
    photo: zod_1.z.string().nonempty('Photo URL is required'),
    biography: zod_1.z
        .string()
        .min(20, 'Biography must be at least 20 characters long'),
    birth_date: zod_1.z.string().date().nonempty('Birth date is required'),
    nationality: zod_1.z.string().nonempty('Nationality is required'),
});
const updateAuthorValidation = createAuthorValidation.partial();
exports.AuthorValidations = {
    createAuthorValidation,
    updateAuthorValidation,
};
