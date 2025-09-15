import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string({
    required_error: "First name is required",
  }),

  middleName: z.string().optional(),

  lastName: z.string({
    required_error: "Last name is required",
  }),

  secondLastName: z.string().optional(),

  documentType: z.string({
    required_error: "Document type is required",
  }),

  documentNumber: z.string({
    required_error: "Document number is required",
  }),

  documentIssueDate: z.coerce.date({
    required_error: "Document issue date is required",
  }),

  country: z.string({
    required_error: "Country is required",
  }),

  state: z.string({
    required_error: "State is required",
  }),

  city: z.string({
    required_error: "City is required",
  }),

  address: z.string({
    required_error: "Address is required",
  }),

  email: z.string({
    required_error: "Email is required",
  }).email({
    message: "Invalid email format",
  }),

  phone: z.string({
    required_error: "Phone is required",
  }),

  birthDate: z.coerce.date({
    required_error: "Birth date is required",
  }),

  password: z.string({
    required_error: "Password is required",
  }).min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const loginSchema = z.object({
  email: z.string({
    required_error: "Email is required",
  }).email({
    message: "Invalid email format",
  }),

  password: z.string({
    required_error: "Password is required",
  }).min(8, {
    message: "Password must be at least 8 characters",
  }),
});