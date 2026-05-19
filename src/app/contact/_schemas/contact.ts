import z from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email"),
  subject: z.string().min(3, "Subject is required").max(50, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});