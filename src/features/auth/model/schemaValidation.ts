import { z } from "zod"

export type LoginInputs = z.infer<typeof schema>

export const schema = z.object({
  email: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string({ required_error: "Email is required" }).email({ message: "Invalid email format" }),
  ),
  password: z.string().min(4, { message: "Password must be at least 3 characters long" }),
  rememberMe: z.boolean(),
  captcha: z.string().optional(),
})
