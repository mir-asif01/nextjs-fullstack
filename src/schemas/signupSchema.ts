import { z } from "zod"

const userNameValidation = z
  .string()
  .min(5, "Username must be at least of 5 characters")
  .max(20, "Max length of username is 20")
  .regex(/[a-zA-Z0-9_]+$/, "Invalid username")

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "invalid emai address" }),
  password: z.string().min(6, "password length should not be  than 6"),
})
