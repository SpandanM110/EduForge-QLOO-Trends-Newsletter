// Quick and simple email test
const RESEND_API_KEY = process.env.RESEND_API_KEY

async function quickEmailTest() {
  console.log("⚡ Quick Email Test")
  console.log("==================")

  if (!RESEND_API_KEY) {
    console.log("❌ No RESEND_API_KEY found")
    console.log("📝 Add your Resend API key to .env file:")
    console.log("   RESEND_API_KEY=re_your_key_here")
    console.log("")
    console.log("🔗 Get your key at: https://resend.com/api-keys")
    return
  }

  console.log("✅ API Key found!")
  console.log("📧 Sending test email...")

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Test <onboarding@resend.dev>",
        to: ["delivered@resend.dev"], // Resend's test email
        subject: "🧪 Quick Test from Qloo Newsletter",
        html: `
          <h1>🎉 Success!</h1>
          <p>Your email system is working!</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Status:</strong> ✅ Delivered</p>
        `,
      }),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("🎉 SUCCESS!")
      console.log(`📧 Email ID: ${result.id}`)
      console.log("✅ Your email system is working perfectly!")
    } else {
      const error = await response.text()
      console.log("❌ Failed:", error)
    }
  } catch (error) {
    console.log("❌ Error:", error.message)
  }
}

quickEmailTest()
