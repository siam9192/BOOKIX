import { z } from "zod";

const createWiseBookValidation = z.object({
    bookId:z.string()
})


export const WiseBookValidations = {
    createWiseBookValidation
}