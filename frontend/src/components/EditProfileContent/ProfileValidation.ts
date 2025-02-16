import { z } from "zod";

// Zod schema for profile form validation
export const profileSchema = z.object({
  firstName: z
    .string()
    .regex(/^[a-zA-Z]+$/, "Only letters are allowed")
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .regex(/^[a-zA-Z]+$/, "Only letters are allowed")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .regex(
      /^\d{3}-\d{3}-\d{4}$/,
      "Phone number must be in the format 222-222-2222",
    )
    .optional()
    .or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  province: z.string().optional().or(z.literal("")),
  postalCode: z
    .string()
    .regex(/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/, "Invalid postal code: X1X 1X1.")
    .optional()
    .or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// Image Validation
export const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
export const maxFileSizeInBytes = 2 * 1024 * 1024;
