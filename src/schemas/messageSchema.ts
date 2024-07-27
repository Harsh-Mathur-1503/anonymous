import {z} from 'zod';

export const messageSchema = z.object({
    content:z
    .string()
    .min(10,"Content must be atleast 10 character long")
    .max(500,"Content must be atmost 500 characters long"),
})