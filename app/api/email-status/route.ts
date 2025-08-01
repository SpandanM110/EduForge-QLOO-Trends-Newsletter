import { NextResponse } from "next/server"
import { getEmailServiceStatus } from "@/lib/email-sender"

export async function GET() {
  const status = getEmailServiceStatus()

  return NextResponse.json({
    email_service: status,
    resend_api_key: process.env.RESEND_API_KEY ? "✅ Configured" : "❌ Missing",
    instructions: {
      setup: "Add RESEND_API_KEY environment variable to enable real email delivery",
      current_mode: status.mode,
      fallback: "System automatically falls back to simulation mode if API key is missing",
    },
  })
}
