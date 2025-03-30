import { z } from "zod";

export const nameValidator = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Please fill in the name field" }),
});
