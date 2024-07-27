import {z} from 'zod';

export const verifySchema = z.object({
    verifyCode: z.string().min(8,"Verification code must be atleast 8 characters long"),
})