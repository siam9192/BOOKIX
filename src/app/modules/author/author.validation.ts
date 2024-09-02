import { z } from 'zod';

const createAuthorValidation = z.object({
  name: z.string().nonempty('Name is required'),
  photo: z.string().nonempty('Photo URL is required'),
  biography: z
    .string()
    .min(20, 'Biography must be at least 20 characters long'),
  birth_date: z.string().date().nonempty('Birth date is required'),
  nationality: z.string().nonempty('Nationality is required'),
});

const updateAuthorValidation = createAuthorValidation.partial();

export const AuthorValidations = {
  createAuthorValidation,
  updateAuthorValidation,
};
