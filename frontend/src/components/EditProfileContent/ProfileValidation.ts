import { z } from "zod";

// Zod schema for profile form validation
export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z]+$/, "Only letters are allowed"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[a-zA-Z]+$/, "Only letters are allowed"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .regex(
      /^\d{3}-\d{3}-\d{4}$/,
      "Phone number must be in the format 222-222-2222"
    ),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/, "Invalid postal code: X1X 1X1."),
  country: z.string().min(1, "Country is required"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;


//Image Validation
export const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
export const maxFileSizeInBytes = 2 * 1024 * 1024;
