// Test script to verify email delivery is working
const RESEND_API_KEY = process.env.RESEND_API_KEY || "YOUR_RESEND_API_KEY_HERE"

async function testEmailDelivery() {
  console.log("🧪 Testing Email Delivery System...")
  console.log("=".repeat(50))

  // Test 1: Check if API key is available
  console.log("📋 Step 1: Checking API Key...")
  if (!RESEND_API_KEY || RESEND_API_KEY === "YOUR_RESEND_API_KEY_HERE") {
    console.log("❌ RESEND_API_KEY not found!")
    console.log("📝 To test real email delivery:")
    console.log("   1. Sign up at https://resend.com")
    console.log("   2. Get your API key")
    console.log("   3. Add it to your .env file as RESEND_API_KEY=your_key_here")
    console.log("   4. Run this script again")
    console.log("")
    console.log("🔄 Running in simulation mode for now...")
    await simulateEmailSend()
    return
  }

  console.log("✅ API Key found!")
  console.log(`🔑 Key: ${RESEND_API_KEY.substring(0, 8)}...${RESEND_API_KEY.slice(-4)}`)

  // Test 2: Send actual test email
  console.log("\n📧 Step 2: Sending Test Email...")

  const testEmail = "test@example.com" // Change this to your email
  const testSubject = "🧪 Qloo Newsletter System Test"
  const testHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Test Email</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 10px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🎉 Email System Test</h1>
            <p>Qloo Newsletter System</p>
        </div>
        
        <div class="content">
            <h2>✅ Success!</h2>
            <p>If you're reading this, the email delivery system is working perfectly!</p>
            
            <div class="success">
                <strong>🚀 System Status:</strong><br>
                ✅ Resend API: Connected<br>
                ✅ Email Delivery: Working<br>
                ✅ HTML Templates: Rendering<br>
                ✅ Newsletter System: Ready
            </div>
            
            <h3>📊 Test Details:</h3>
            <ul>
                <li><strong>Sent at:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>API:</strong> Resend</li>
                <li><strong>Template:</strong> HTML with CSS</li>
                <li><strong>Status:</strong> Delivered Successfully</li>
            </ul>
            
            <h3>🎯 Next Steps:</h3>
            <p>Your newsletter system is ready! Users can now:</p>
            <ul>
                <li>Subscribe to newsletters</li>
                <li>Receive personalized content</li>
                <li>Get trending insights from Qloo API</li>
                <li>Enjoy beautiful HTML email templates</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>This is a test email from your Qloo Newsletter System</p>
            <p>Generated at ${new Date().toISOString()}</p>
        </div>
    </body>
    </html>
  `

  try {
    console.log(`📬 Sending to: ${testEmail}`)
    console.log(`📝 Subject: ${testSubject}`)

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Qloo Newsletter <onboarding@resend.dev>",
        to: [testEmail],
        subject: testSubject,
        html: testHTML,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.log(`❌ Email failed: ${response.status}`)
      console.log(`📄 Error: ${errorData}`)

      // Common error solutions
      if (response.status === 401) {
        console.log("\n🔧 Solution: Check your API key")
        console.log("   - Make sure RESEND_API_KEY is correct")
        console.log("   - Verify the key has sending permissions")
      } else if (response.status === 422) {
        console.log("\n🔧 Solution: Check email format")
        console.log("   - Make sure 'from' email is verified in Resend")
        console.log("   - Check 'to' email format is valid")
      }

      return
    }

    const result = await response.json()
    console.log("✅ Email sent successfully!")
    console.log(`📧 Email ID: ${result.id}`)
    console.log(`🎯 Sent to: ${testEmail}`)

    console.log("\n🎉 SUCCESS! Your email system is working!")
    console.log("📬 Check your inbox for the test email")
    console.log("🚀 Newsletter subscription system is ready to use!")
  } catch (error) {
    console.log("❌ Error sending email:", error.message)
    console.log("\n🔧 Troubleshooting:")
    console.log("   1. Check your internet connection")
    console.log("   2. Verify RESEND_API_KEY is correct")
    console.log("   3. Make sure you have Resend credits")
    console.log("   4. Check if your domain is verified (if using custom domain)")
  }
}

async function simulateEmailSend() {
  console.log("\n📧 Simulating Email Send...")
  console.log("📬 To: test@example.com")
  console.log("📝 Subject: 🧪 Qloo Newsletter System Test")
  console.log("📄 Content: HTML email with styling")

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log("✅ Email simulation complete!")
  console.log("🔄 This would be a real email if RESEND_API_KEY was configured")
  console.log("\n📋 To enable real email delivery:")
  console.log("   1. Get API key from https://resend.com")
  console.log("   2. Add to .env: RESEND_API_KEY=your_key_here")
  console.log("   3. Restart the development server")
  console.log("   4. Run this script again")
}

// Test different email scenarios
async function testMultipleEmails() {
  console.log("\n🔄 Testing Multiple Email Scenarios...")

  const testCases = [
    {
      email: "spandanmukherjee2003@gmail.com",
      name: "Test User 1",
      categories: ["artists", "trends"],
    },
    {
      email: "user2@example.com",
      name: "Test User 2",
      categories: ["movies", "books"],
    },
    {
      email: "user3@example.com",
      name: "Test User 3",
      categories: ["artists", "movies", "trends"],
    },
  ]

  for (const testCase of testCases) {
    console.log(`\n📧 Testing: ${testCase.email}`)
    console.log(`👤 Name: ${testCase.name}`)
    console.log(`📂 Categories: ${testCase.categories.join(", ")}`)

    try {
      const response = await fetch("http://localhost:3000/api/send-test-newsletter-optimized", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testCase),
      })

      const result = await response.json()

      if (result.success) {
        console.log(`✅ ${testCase.email}: ${result.message}`)
        console.log(`📰 Newsletter: ${result.newsletter.title}`)
        console.log(`📊 Articles: ${result.articles_count}`)
      } else {
        console.log(`❌ ${testCase.email}: ${result.error}`)
      }
    } catch (error) {
      console.log(`❌ ${testCase.email}: Network error`)
    }

    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

// Main execution
async function runAllTests() {
  console.log("🚀 Starting Comprehensive Email System Test")
  console.log("=".repeat(60))

  // Test 1: Direct email delivery
  await testEmailDelivery()

  console.log("\n" + "=".repeat(60))

  // Test 2: Newsletter API endpoints
  console.log("🧪 Testing Newsletter API Integration...")
  await testMultipleEmails()

  console.log("\n" + "=".repeat(60))
  console.log("🎯 Test Complete!")
  console.log("📊 Check the results above to verify everything is working")
}

// Run the tests
runAllTests()
