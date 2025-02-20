import { z } from "zod"

export type LoginInputs = z.infer<typeof authSchema>

export const authSchema = z.object({
  email: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string({ required_error: "Email is required" }).email({ message: "Invalid email format" }),
  ),
  password: z.string(),
  rememberMe: z.boolean(),
  captcha: z.string().optional(),
})
