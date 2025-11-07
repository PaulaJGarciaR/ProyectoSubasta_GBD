import { z } from "zod";

export const createProductSchema = z.object({
  title: z
    .string({
      required_error: "El título es requerido",
    })
    .min(3, {
      message: "El título debe tener al menos 3 caracteres",
    }),

  description: z
    .string({
      required_error: "La descripción es requerida",
    })
    .min(10, {
      message: "La descripción debe tener al menos 10 caracteres",
    }),

  image: z
    .string({
      required_error: "La imagen es requerida",
    })
    .url({
      message: "La imagen debe ser una URL válida",
    }),

  category: z.string({
    required_error: "La categoria es requerido",
  }),

  startingPrice: z
    .number({
      required_error: "El precio inicial es requerido",
      invalid_type_error: "El precio inicial debe ser un número",
    })
    .positive({
      message: "El precio inicial debe ser mayor que 0",
    }),

  dateStart: z.coerce.date({
    required_error: "La fecha de inicio es requerida",
    invalid_type_error: "La fecha de inicio debe ser válida",
  }),

  dateEnd: z.coerce
    .date({
      required_error: "La fecha de cierre es requerida",
      invalid_type_error: "La fecha de cierre debe ser válida",
    })
    .refine(
      (date, ctx) => {
        if (!ctx?.parent?.dateStart) return true;
        return date > ctx.parent.dateStart;
      },
      {
        message: "La fecha de cierre debe ser posterior a la fecha de inicio",
      }
    ),
});
