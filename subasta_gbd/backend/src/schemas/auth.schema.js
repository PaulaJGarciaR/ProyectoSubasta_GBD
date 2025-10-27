import { z } from "zod";

export const registerSchema = z.object({
  userType: z.string(),
  firstName: z
    .string({
      required_error: "El primer nombre es requerido",
    })
    .min(3, {
      message: "Mínimo 3 caracteres",
    }),

  middleName: z.string().optional(),

  lastName: z
    .string({
      required_error: "El primer apellido es requerido",
    })
    .min(3, {
      message: "Mínimo 3 caracteres",
    }),

  secondLastName: z.string().optional(),

  documentType: z.string({
    required_error: "El tipo de documento es requerido",
  }),

  documentNumber: z
    .string({
      required_error: "El numero de documento es requerido",
    })
    .min(10, {
      message: "Debe tener 10 dígitos",
    }),

  documentIssueDate: z.coerce
    .date({
      required_error: "La fecha de expedición es requerida",
    })
    .max(new Date(), "La fecha de expedición no puede ser futura"),

  country: z
    .string({
      required_error: "El pais es requerido",
    })
    .min(3, {
      message: "Mínimo 3 caracteres",
    }),

  state: z
    .string({
      required_error: "El departamento es requerido",
    })
    .min(3, {
      message: "Mínimo 3 caracteres",
    }),

  city: z
    .string({
      required_error: "La ciudad es requerida",
    })
    .min(3, {
      message: "Mínimo 3 caracteres",
    }),

  address: z
    .string({
      required_error: "La dirección es requerida",
    })
    .min(3, {
      message: "Mínimo 3 caracteres",
    }),

  email: z
    .string({
      required_error: "El email es requerido",
    })
    .email({
      message: "Formato de email Inválido",
    }),

  phone: z
    .string({
      required_error: "El telefono es requerido",
    })
    .min(3, {
      message: "Mínimo 3 caracteres",
    }),

  birthDate: z.coerce
    .date({
      required_error: "La fecha de nacimiento es requerida.",
    })
    .max(new Date(), "La fecha de nacimiento no puede ser futura.")
    .refine((date) => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 18;
    }, "Debes ser mayor de 18 años"),

  password: z
    .string({
      required_error: "La contraseña es requerida",
    })
    .min(8, {
      message: "La contraseña debe tener mínimo 8 caracteres",
    })
    .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, {
      message:
        "La contraseña debe contener al menos un número y un carácter especial",
    }),
  personType: z.string().optional(),

  nitPersonaNatural: z
    .string()
    .min(9, {
      message: "Mínimo 9 dígitos",
    })
    .optional(),

  razonSocial: z
    .string()
    .min(3, {
      message: "Mínimo 3 caracteres",
    })
    .optional(),

  sociedad: z.string().optional(),
  nitPersonaJuridica: z
    .string()
    .min(9, {
      message: "Mínimo 9 dígitos",
    })
    .optional(),

  matriculaMercantil: z.string().optional(),

  fechaDeConstitucion: z.coerce.date().optional(),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Campo obligatorio: Email*",
    })
    .email({
      message: "Formato de email inválido",
    }),

  password: z
    .string({
      required_error: "Campo obligatorio: Contraseña*",
    })
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    }),
});
