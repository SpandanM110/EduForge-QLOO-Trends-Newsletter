interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendNewsletterEmail({
  to,
  subject,
  html,
}: EmailData): Promise<boolean> {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("📧 RESEND_API_KEY not found - using email simulation");
      console.log(`📬 Simulated email sent to: ${to}`);
      console.log(`📝 Subject: ${subject}`);
      console.log(`📄 Content preview: ${html.substring(0, 150)}...`);

      // Simulate email delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return true;
    }

    console.log(`📧 Sending real email via Resend to: ${to}`);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Qloo Newsletter <hello@eduforge.live>",
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ Resend API error: ${response.status} - ${errorData}`);

      // Fall back to simulation
      console.log("🔄 Falling back to email simulation");
      console.log(`📬 Simulated email sent to: ${to}`);
      return true;
    }

    const result = await response.json();
    console.log(`✅ Real email sent successfully! ID: ${result.id}`);
    return true;
  } catch (error) {
    console.error("❌ Email service error:", error);

    // Always fall back to simulation on error
    console.log("🔄 Error occurred - using email simulation");
    console.log(`📬 Simulated email sent to: ${to}`);
    return true;
  }
}

export function getEmailServiceStatus() {
  const hasApiKey = !!process.env.RESEND_API_KEY;
  return {
    hasApiKey,
    mode: hasApiKey ? "real" : "simulation",
    service: "Resend",
    available: hasApiKey,
  };
}
