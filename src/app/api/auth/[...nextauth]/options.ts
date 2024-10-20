import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"
import bcrypt from "bcryptjs"
import { connectDb } from "@/lib/connectDb"
import userModel from "@/models/user.model"
import { pages } from "next/dist/build/templates/app-page"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await connectDb()
        try {
          const user = await userModel.findOne({
            $or: [
              { email: credentials.identifier.email },
              { username: credentials.identifier?.username },
            ],
          })

          if (!user) {
            throw new Error("User not found with the email")
          }

          if (!user.isVerified) {
            throw new Error("Please verify email before login")
          }

          const isPasswordMatching = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (isPasswordMatching) {
            return user
          } else {
            throw new Error("Incorrect password")
          }
        } catch (error: any) {
          throw new Error(error)
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id?.toString()
        session.user.isVerified = token.isVerified
        session.user.isAcceptingMessages = token.isAcceptingMessages
        session.user.username = token.username
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString()
        token.username = user.username
        token.isVerified = user.isVerified
        token.isAcceptingMessages = user.isAcceptingMessages
      }
      return token
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET!,
}
