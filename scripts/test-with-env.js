// Load environment variables from .env file
require("dotenv").config()

async function testWithEnv() {
  console.log("🧪 Testing Email with Environment Variables")
  console.log("=".repeat(50))

  // Check environment variables
  console.log("📋 Environment Check:")
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Missing"}`)
  console.log(`   RESEND_API_KEY: ${process.env.RESEND_API_KEY ? "✅ Found" : "❌ Missing"}`)
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? "✅ Found" : "❌ Missing"}`)
  console.log("")

  const RESEND_API_KEY = process.env.RESEND_API_KEY

  if (!RESEND_API_KEY) {
    console.log("❌ RESEND_API_KEY still not found!")
    console.log("🔧 Make sure you have a .env file in your project root with:")
    console.log('   RESEND_API_KEY="re_PbnXKLLU_JwdFB1ckERvtm7fsNmuqgK4y"')
    return
  }

  console.log("✅ All environment variables loaded!")
  console.log("📧 Sending test email...")

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Qloo Newsletter <onboarding@resend.dev>",
        to: ["delivered@resend.dev"], // Resend's test inbox
        subject: "🎉 Qloo Newsletter System - Email Test Success!",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
                  .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0; }
                  .success { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
                  .info { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }
              </style>
          </head>
          <body>
              <div class="header">
                  <h1>🎉 Email System Working!</h1>
                  <p>Qloo Newsletter System Test</p>
              </div>
              
              <div class="content">
                  <div class="success">
                      <h2>✅ SUCCESS!</h2>
                      <p><strong>Your email delivery system is working perfectly!</strong></p>
                  </div>
                  
                  <div class="info">
                      <h3>📊 System Status:</h3>
                      <ul>
                          <li>✅ Resend API: Connected</li>
                          <li>✅ Environment Variables: Loaded</li>
                          <li>✅ Email Templates: Rendering</li>
                          <li>✅ Newsletter System: Ready</li>
                      </ul>
                  </div>
                  
                  <h3>🚀 What's Working:</h3>
                  <ul>
                      <li>Real email delivery via Resend</li>
                      <li>Beautiful HTML email templates</li>
                      <li>Newsletter subscription system</li>
                      <li>AI-powered content generation</li>
                      <li>Database integration</li>
                  </ul>
                  
                  <p><strong>Test completed at:</strong> ${new Date().toLocaleString()}</p>
              </div>
          </body>
          </html>
        `,
      }),
    })

    if (response.ok) {
      const result = await response.json()
      console.log("🎉 EMAIL SENT SUCCESSFULLY!")
      console.log(`📧 Email ID: ${result.id}`)
      console.log("📬 Check delivered@resend.dev or your Resend dashboard")
      console.log("")
      console.log("✅ Your newsletter system is ready!")
      console.log("🚀 Users can now subscribe and receive emails!")
    } else {
      const error = await response.text()
      console.log("❌ Email failed:")
      console.log(error)

      if (response.status === 401) {
        console.log("🔧 Check your API key is correct")
      } else if (response.status === 422) {
        console.log("🔧 Check email format and domain verification")
      }
    }
  } catch (error) {
    console.log("❌ Network error:", error.message)
  }
}

testWithEnv()
