import {z} from 'zod';

export const signinSchema = z.object({
    identifier: z.string().min(2,"Identifier must be atleast 2 characters long"),
    password: z.string().min(8,"Password must be atleast 8 characters long"),
})