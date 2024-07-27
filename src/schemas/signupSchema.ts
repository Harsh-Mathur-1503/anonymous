import {z} from 'zod';

export const usernameValidation = z
   .string()
   .min(2,"Username must be atleast 2 characters long")
   .max(23,"Username must be atmost 20 characters long")
   .regex(/^[a-zA-Z0-9_]+$/,"Username must contain only letters, numbers and underscores")


export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(8,"Password must be atleast 8 characters long"),
})