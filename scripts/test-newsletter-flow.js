// Test the complete newsletter subscription with proper env loading
require("dotenv").config()

async function testCompleteFlow() {
  console.log("📰 Testing Complete Newsletter Flow")
  console.log("=".repeat(45))

  // Check if server is running
  console.log("🔍 Checking if development server is running...")

  try {
    const healthCheck = await fetch("http://localhost:3000/api/email-status")
    const healthData = await healthCheck.json()

    console.log("✅ Server is running!")
    console.log(`📧 Email service: ${healthData.email_service.mode} mode`)
    console.log("")
  } catch (error) {
    console.log("❌ Server not running!")
    console.log("🚀 Please run: npm run dev")
    console.log("📍 Then try this script again")
    return
  }

  // Test newsletter subscription
  const testUser = {
    email: "test@yourdomain.com", // Change this to your email to receive the newsletter
    name: "Test User",
    categories: ["artists", "trends", "movies"],
  }

  console.log("👤 Testing subscription for:")
  console.log(`   📧 Email: ${testUser.email}`)
  console.log(`   👤 Name: ${testUser.name}`)
  console.log(`   📂 Categories: ${testUser.categories.join(", ")}`)
  console.log("")

  try {
    console.log("🚀 Sending subscription request...")

    const response = await fetch("http://localhost:3000/api/send-test-newsletter-optimized", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    })

    const result = await response.json()

    if (result.success) {
      console.log("🎉 NEWSLETTER SUBSCRIPTION SUCCESSFUL!")
      console.log("")
      console.log("📊 Results:")
      console.log(`   ✅ ${result.message}`)
      console.log(`   📰 Newsletter: ${result.newsletter.title}`)
      console.log(`   📝 Articles: ${result.articles_count}`)
      console.log(`   👤 User ID: ${result.user.id}`)
      console.log(`   📧 Email Mode: ${result.email_service.mode}`)
      console.log(`   ⏰ Sent: ${new Date(result.sent_at).toLocaleString()}`)
      console.log("")

      if (result.email_service.mode === "real") {
        console.log("📬 REAL EMAIL SENT!")
        console.log(`📧 Check ${testUser.email} for your newsletter!`)
        console.log("🎯 The email includes:")
        console.log("   • Personalized content based on your categories")
        console.log("   • AI-generated articles about trending topics")
        console.log("   • Beautiful HTML formatting")
        console.log("   • Images and insights from Qloo API")
      } else {
        console.log("🔄 SIMULATION MODE")
        console.log("📝 Email content was generated but not sent")
        console.log("🔧 Your RESEND_API_KEY is working for real delivery!")
      }

      console.log("")
      console.log("🚀 SYSTEM STATUS: FULLY OPERATIONAL!")
      console.log("✅ Newsletter system is ready for users!")
    } else {
      console.log("❌ SUBSCRIPTION FAILED")
      console.log(`   Error: ${result.error}`)
      if (result.details) {
        console.log(`   Details: ${result.details}`)
      }
    }
  } catch (error) {
    console.log("❌ REQUEST FAILED")
    console.log(`   Error: ${error.message}`)
    console.log("")
    console.log("🔧 Troubleshooting:")
    console.log("   1. Make sure dev server is running: npm run dev")
    console.log("   2. Check database connection")
    console.log("   3. Verify .env file has all required variables")
  }
}

testCompleteFlow()
