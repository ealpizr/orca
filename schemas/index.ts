import { z } from "zod";

export const loginSchema = z.object({
  id: z
    .preprocess(
      (x) => parseInt(x as string),
      z.number({ invalid_type_error: "Must be a number" })
    )
    .refine((x) => x.toString().length === 9, {
      message: "Must be 9 digits long",
    }),

  password: z.string().min(1, { message: "Required" }),
});
