import { z } from "zod"

export const messageSchema = z.object({
  content: z.string().max(200, "Content length must be less than 200"),
})
