import { type NextRequest, NextResponse } from "next/server"
import { newsletterGenerator } from "@/lib/newsletter-generator"
import { sendNewsletterEmail, getEmailServiceStatus } from "@/lib/email-sender"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email, name, categories } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 })
    }

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: "At least one category must be selected" }, { status: 400 })
    }

    console.log(`📧 Processing optimized newsletter subscription for: ${email}`)
    console.log(`📂 Categories: ${categories.join(", ")}`)

    // Step 1: Create or update user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
        updatedAt: new Date(),
      },
      create: {
        email,
        name: name || undefined,
      },
    })

    console.log(`👤 User ${user.id} (${user.email}) ${user.createdAt === user.updatedAt ? "created" : "updated"}`)

    // Step 2: Deduplicate categories and ensure all categories exist
    const uniqueCategories = [...new Set(categories)] // Remove duplicates
    console.log(`📂 Unique Categories: ${uniqueCategories.join(", ")}`)

    const categoryRecords = []
    for (const categoryName of uniqueCategories) {
      // Create category if it doesn't exist
      const category = await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: {
          name: categoryName,
          label: formatCategoryLabel(categoryName), // Add the required label field
        },
      })

      categoryRecords.push(category)

      // Create or update user-category relationship using upsert
      await prisma.userCategory.upsert({
        where: {
          userId_categoryId: {
            userId: user.id,
            categoryId: category.id,
          },
        },
        update: {
          // Update timestamp to show renewed interest
          createdAt: new Date(),
        },
        create: {
          userId: user.id,
          categoryId: category.id,
        },
      })
    }

    console.log(`✅ User-category relationships established for ${categoryRecords.length} categories`)

    // Step 3: Generate or get newsletter for this week
    const result = await newsletterGenerator.generateNewsletterContentWithDB(uniqueCategories)

    if (result.articles.length === 0) {
      return NextResponse.json({ error: "Failed to generate newsletter content" }, { status: 500 })
    }

    console.log(`📰 Newsletter ready: ${result.newsletter.id} with ${result.articles.length} articles`)

    // Step 4: Check if we already sent this newsletter to this user
    const alreadySent = await prisma.newsletterSent.findUnique({
      where: {
        userId_newsletterId: {
          userId: user.id,
          newsletterId: result.newsletter.id,
        },
      },
    })

    if (alreadySent) {
      console.log(`⚠️ Newsletter ${result.newsletter.id} already sent to user ${user.id} on ${alreadySent.sentAt}`)
      return NextResponse.json({
        success: true,
        message: `Welcome back! You've already received this week's newsletter. Check your email from ${alreadySent.sentAt.toLocaleDateString()}.`,
        newsletter: {
          id: result.newsletter.id,
          title: result.newsletter.title,
          alreadySent: true,
          sentAt: alreadySent.sentAt,
        },
        articles_count: result.articles.length,
        user: {
          id: user.id,
          email: user.email,
          isExisting: user.createdAt !== user.updatedAt,
        },
        email_service: getEmailServiceStatus(),
      })
    }

    // Step 5: Send email - always works (real or simulation)
    const emailStatus = getEmailServiceStatus()
    console.log(`📬 Email mode: ${emailStatus.mode}`)

    const emailSent = await sendNewsletterEmail({
      to: email,
      subject: result.newsletter.title,
      html: result.newsletter.htmlContent,
    })

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    // Step 6: Mark newsletter as sent
    await prisma.newsletterSent.create({
      data: {
        userId: user.id,
        newsletterId: result.newsletter.id,
        sentAt: new Date(),
      },
    })

    console.log(`✅ Newsletter sent successfully to ${email}`)

    return NextResponse.json({
      success: true,
      message: emailStatus.hasApiKey
        ? `🎉 Newsletter "${result.newsletter.title}" sent to ${email}!`
        : `🎉 Newsletter "${result.newsletter.title}" generated! (Email simulation mode - check console for content)`,
      newsletter: {
        id: result.newsletter.id,
        title: result.newsletter.title,
        subtitle: result.newsletter.subtitle,
        weekOf: result.newsletter.weekOf,
        categories: result.newsletter.categories,
        isExisting: result.newsletter.isExisting,
      },
      articles_count: result.articles.length,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isExisting: user.createdAt !== user.updatedAt,
      },
      email_service: emailStatus,
      sent_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error in optimized newsletter subscription:", error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          {
            error: "Subscription already exists",
            details: "You're already subscribed with these categories. Check your email for recent newsletters.",
          },
          { status: 409 },
        )
      }
    }

    return NextResponse.json(
      {
        error: "Failed to process newsletter subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function formatCategoryLabel(categoryName: string): string {
  const labelMap: Record<string, string> = {
    artists: "Artists & Musicians",
    trends: "Cultural Trends",
    movies: "Movies & TV",
    books: "Books & Literature",
    tv_shows: "Television & Streaming",
  }

  return labelMap[categoryName] || categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
}

export async function GET() {
  const emailStatus = getEmailServiceStatus()

  return NextResponse.json({
    message: "Optimized Newsletter Subscription API with Database Integration",
    email_service: emailStatus,
    features: [
      "User management with upsert operations",
      "Category management and user-category relationships",
      "Newsletter generation with database caching",
      "Duplicate prevention for newsletters",
      "Email delivery with HTML templates",
      "Comprehensive error handling",
      "Subscription status tracking",
      emailStatus.available ? "Real email delivery via Resend" : "Email simulation mode (no RESEND_API_KEY)",
    ],
    endpoints: {
      subscribe: "POST /api/send-test-newsletter-optimized",
    },
    request_body: {
      email: "string - Required email address",
      name: "string - Optional user name",
      categories: "string[] - Required array of category names",
    },
    response: {
      success: "boolean",
      message: "string - User-friendly message",
      newsletter: "object - Newsletter details",
      articles_count: "number - Number of articles generated",
      user: "object - User information",
      email_service: "object - Email service status",
      sent_at: "string - ISO timestamp",
    },
    setup_instructions: {
      real_email: "Add RESEND_API_KEY environment variable to enable real email delivery",
      test_mode: "Without RESEND_API_KEY, system runs in simulation mode",
    },
  })
}
