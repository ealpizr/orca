import { z } from "zod";

export const loginSchema = z.object({
  id: z
    .preprocess((x) => parseInt(x as string), z.number())
    .refine((x) => x.toString().length === 9),

  password: z.string().min(1),

  token: z.string().min(1),
});
