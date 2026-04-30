import z from "zod";

export const formSchema = z.object({
    email: z.email().max(128),
    password: z.string().min(8).max(128),
});