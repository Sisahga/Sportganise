import { z } from "zod";

// Zod schema for profile form validation
export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name cannot be empty")
    .regex(/^[a-zA-Z]+$/, "Only letters are allowed"),

  lastName: z
    .string()
    .min(1, "Last name cannot be empty")
    .regex(/^[a-zA-Z]+$/, "Only letters are allowed"),

  email: z
    .string()
    .min(1, "Email cannot be empty")
    .email("Invalid email address"),

  phone: z
    .string()
    .min(1, "Phone number cannot be empty")
    .min(10, "Phone number must be 10 digits")
    .regex(
      /^\d{3}-\d{3}-\d{4}$/,
      "Phone number must be in the format 111-111-1111",
    ),

  address: z.string().min(1, "Address cannot be empty"),

  city: z.string().min(1, "City cannot be empty"),

  province: z.string().min(1, "Province cannot be empty"),

  postalCode: z
    .string()
    .min(1, "Postal code cannot be empty")
    .regex(
      /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
      "Invalid postal code: X1X 1X1.",
    ),

  country: z.string().min(1, "Country cannot be empty"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// Image Validation
export const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
export const maxFileSizeInBytes = 2 * 1024 * 1024;
