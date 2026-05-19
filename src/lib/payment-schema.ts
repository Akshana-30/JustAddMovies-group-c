import z from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  card: z
    .string()
    .min(1, "Card number is required")
    .transform((val) => val.replace(/\s/g, ""))
    .pipe(
      z
        .string()
        .regex(/^\d+$/, "Card number must contain only digits")
        .min(13, "Enter a valid card number")
        .max(16, "Enter a valid card number"),
    ),
  expires: z
    .string()
    .min(1, "Expiry is required")
    .refine((val) => /^\d{2}\/\d{2}$/.test(val), "Use MM/YY format")
    .refine((val) => {
      if (!/^\d{2}\/\d{2}$/.test(val)) return true;
      const [mm] = val.split("/").map(Number);
      return mm >= 1 && mm <= 12;
    }, "Invalid month")
    .refine((val) => {
      if (!/^\d{2}\/\d{2}$/.test(val)) return true;
      const [, yy] = val.split("/").map(Number);
      return yy <= (new Date().getFullYear() % 100) + 5;
    }, "Invalid year")
    .refine((val) => {
      if (!/^\d{2}\/\d{2}$/.test(val)) return true;
      const now = new Date();
      const [mm, yy] = val.split("/").map(Number);
      return (
        new Date(2000 + yy, mm - 1, 1) >=
        new Date(now.getFullYear(), now.getMonth(), 1)
      );
    }, "Card has expired"),
  cvv: z
    .string()
    .min(1, "CVV is required")
    .refine((val) => /^\d+$/.test(val), "CVV must be numeric")
    .refine(
      (val) => val.length >= 3 && val.length <= 4,
      "CVV must be 3 or 4 digits",
    ),
  streetAddress: z.string().min(1, "Street is required"),
  zip: z.string().min(1, "Zip is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});