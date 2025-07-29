interface EmailData {
  to: string
  subject: string
  html: string
}

export class EmailService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || ""
  }

  async sendEmail({ to, subject, html }: EmailData): Promise<boolean> {
    try {
      // Using Resend API (you can replace with any email service)
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "newsletter@yourdomain.com", // Replace with your domain
          to: [to],
          subject: subject,
          html: html,
        }),
      })

      if (!response.ok) {
        console.error("Email send failed:", await response.text())
        return false
      }

      console.log("✅ Email sent successfully to:", to)
      return true
    } catch (error) {
      console.error("❌ Email service error:", error)
      return false
    }
  }

  // Fallback method using console log for testing without email service
  async sendTestEmail({ to, subject, html }: EmailData): Promise<boolean> {
    console.log("📧 TEST EMAIL SIMULATION")
    console.log("To:", to)
    console.log("Subject:", subject)
    console.log("HTML Content Preview:", html.substring(0, 200) + "...")

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return true
  }
}

export const emailService = new EmailService()
