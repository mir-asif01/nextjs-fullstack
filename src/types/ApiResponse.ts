import { Message } from "@/models/user.model"

export interface ApiResponse {
  success: boolean
  message: string
  statusCode?: number
  isAcceptingMessages?: boolean
  messages?: Array<Message>
}
