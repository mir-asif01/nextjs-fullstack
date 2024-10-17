import mongoose, { Schema, Document } from "mongoose"

export interface Message extends Document {
  content: string
  createdAt: Date
}

// capital String is from mongoose
// small string is from typescript type

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: [true, "message must have content"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
})

export interface User extends Document {
  username: string
  email: string
  password: string
  verifyToken: string
  verifyTokenExpiry: Date
  isVerified: boolean
  isAcceptingMessage: boolean
  messages: Array<Message>
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "user must have an username"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "user must have an email"],
    match: [/.+@.+\..+/, "provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "user must have password"],
  },
  verifyToken: {
    type: String,
    required: [true, "verify token is required"],
  },
  verifyTokenExpiry: {
    type: Date,
    required: [true, "token expiry is required"],
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
})

const userModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema)

export default userModel
