import { resend } from "@/lib/resend"
import VerificationEmail from "../../emails/verification.template.email"
import { ApiResponse } from "@/types/ApiResponse"

async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "<onboarding@resend.dev>",
      to: email,
      subject: "Hello world",
      react: VerificationEmail({ username, otp: verificationCode }),
    })

    return { success: true, message: "Verification email send successfully" }
  } catch (error) {
    console.log("error while sending verification email", error)
    return { success: false, message: "Sending verification email failed" }
  }
}
