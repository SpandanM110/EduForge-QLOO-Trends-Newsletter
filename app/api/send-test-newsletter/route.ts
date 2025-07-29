import { type NextRequest, NextResponse } from "next/server"
import { newsletterGenerator } from "@/lib/newsletter-generator"
import { emailService } from "@/lib/email-service"
import { generateNewsletterEmailHTML } from "@/lib/email-template"

export async function POST(request: NextRequest) {
  try {
    const { email, name, categories } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 })
    }

    console.log(`📧 Generating test newsletter for: ${email}`)

    // Generate newsletter content
    const testCategories = categories || ["artists", "trends", "movies"]
    const articles = await newsletterGenerator.generateNewsletterContent(testCategories)

    if (articles.length === 0) {
      return NextResponse.json({ error: "Failed to generate newsletter content" }, { status: 500 })
    }

    // Generate email HTML
    const emailHTML = generateNewsletterEmailHTML(articles, name)
    const subject = `🎵 Your Qloo Trends Newsletter - ${new Date().toLocaleDateString()}`

    // Send email (using test method for now)
    const emailSent = await emailService.sendTestEmail({
      to: email,
      subject: subject,
      html: emailHTML,
    })

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Test newsletter sent to ${email}`,
      articles_generated: articles.length,
      email_preview: emailHTML.substring(0, 500) + "...",
      sent_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error sending test newsletter:", error)
    return NextResponse.json(
      {
        error: "Failed to send test newsletter",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
