import { connectDb } from "@/lib/connectDb"
import userModel from "@/models/user.model"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import { NextRequest } from "next/server"
import { request } from "http"

export async function POST(request: NextRequest) {
  await connectDb()
  try {
    const { username, email, password } = await request.json()
    const existingVerifiedUserByUsername = await userModel.findOne({
      username,
      isVerified: true,
    })

    if (existingVerifiedUserByUsername) {
      return Response.json({
        message: "Username is already taken",
        success: false,
      })
    }

    const existingUserByEmail = await userModel.findOne({ email })
    const verifyCode = Math.floor(100000 + Math.random() * 90000).toString()
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json({
          message: "Try another email, user already exits with this email",
          success: false,
        })
      } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        existingUserByEmail.password = hashedPassword
        existingUserByEmail.verifyCode = verifyCode
        existingUserByEmail.verifyTokenExpiry = new Date(Date.now() + 3600000)
        await existingUserByEmail.save()
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 1)

      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyTokenExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      })
      await newUser.save()
    }

    //sending email verification code

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    )
    if (!emailResponse.success) {
      return Response.json({
        message: "sending verification email failed",
        success: false,
      })
    }
    return Response.json({
      message: "verification email sent, please verify email",
      success: false,
    })
  } catch (error) {
    console.log("Error while signup", error)
    return Response.json({ message: "Error while signup", success: false })
  }
}
