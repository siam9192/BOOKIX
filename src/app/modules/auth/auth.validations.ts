import { z } from "zod";

const loginValidation = z.object({
    email:z.string({required_error:'Email is required'}).email('Enter valid email'),
    password:z.string({required_error:'Password is required'}).min(6,'Password must be at least 6 character')
})



export const AuthValidations = {
    loginValidation
}