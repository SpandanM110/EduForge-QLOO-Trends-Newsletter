// Test the full newsletter subscription flow
async function testNewsletterFlow() {
  console.log("📰 Testing Newsletter Subscription Flow")
  console.log("=".repeat(45))

  const testUser = {
    email: "test@example.com", // Change this to your email
    name: "Test User",
    categories: ["artists", "trends", "movies"],
  }

  console.log("👤 Test User:")
  console.log(`   Email: ${testUser.email}`)
  console.log(`   Name: ${testUser.name}`)
  console.log(`   Categories: ${testUser.categories.join(", ")}`)
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
      console.log("✅ SUBSCRIPTION SUCCESSFUL!")
      console.log("")
      console.log("📊 Results:")
      console.log(`   Message: ${result.message}`)
      console.log(`   Newsletter: ${result.newsletter.title}`)
      console.log(`   Articles Generated: ${result.articles_count}`)
      console.log(`   User ID: ${result.user.id}`)
      console.log(`   Email Mode: ${result.email_service.mode}`)
      console.log(`   Sent At: ${result.sent_at}`)
      console.log("")

      if (result.email_service.mode === "real") {
        console.log("📧 REAL EMAIL SENT!")
        console.log("📬 Check your inbox for the newsletter!")
      } else {
        console.log("🔄 EMAIL SIMULATION MODE")
        console.log("📝 Add RESEND_API_KEY to .env for real email delivery")
      }

      console.log("")
      console.log("🎉 Newsletter system is working perfectly!")
    } else {
      console.log("❌ SUBSCRIPTION FAILED")
      console.log(`   Error: ${result.error}`)
      console.log(`   Details: ${result.details || "No additional details"}`)
    }
  } catch (error) {
    console.log("❌ NETWORK ERROR")
    console.log(`   Error: ${error.message}`)
    console.log("")
    console.log("🔧 Troubleshooting:")
    console.log("   1. Make sure your dev server is running (npm run dev)")
    console.log("   2. Check if localhost:3000 is accessible")
    console.log("   3. Verify your database is connected")
  }
}

// Run the test
testNewsletterFlow()
