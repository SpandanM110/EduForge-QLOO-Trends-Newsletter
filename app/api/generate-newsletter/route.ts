import { type NextRequest, NextResponse } from "next/server"
import { newsletterGenerator } from "@/lib/newsletter-generator"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY environment variable is required" }, { status: 500 })
    }

    const { categories, userPreferences, location, personalized = false } = await request.json()

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json({ error: "Categories array is required" }, { status: 400 })
    }

    console.log("🚀 Generating newsletter with options:", {
      categories,
      personalized,
      location,
      hasPreferences: !!userPreferences,
    })

    let articles

    if (location) {
      // Generate location-based newsletter
      articles = await newsletterGenerator.generateLocationBasedNewsletter(location, categories)
    } else if (personalized && userPreferences) {
      // Generate personalized newsletter
      articles = await newsletterGenerator.generatePersonalizedNewsletter(categories, userPreferences)
    } else {
      // Generate standard newsletter
      articles = await newsletterGenerator.generateNewsletterContent(categories)
    }

    console.log(`✅ Generated ${articles.length} articles`)

    return NextResponse.json({
      success: true,
      articles,
      generated_at: new Date().toISOString(),
      total_articles: articles.length,
      generation_type: location ? "location-based" : personalized ? "personalized" : "standard",
    })
  } catch (error) {
    console.error("❌ Error generating newsletter:", error)
    return NextResponse.json(
      {
        error: "Failed to generate newsletter",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Advanced Newsletter Generation API",
    features: [
      "Standard newsletter generation",
      "Personalized recommendations based on user preferences",
      "Location-based content recommendations",
      "Demographic insights integration",
      "Advanced Qloo Insights API integration",
    ],
    endpoints: {
      generate_standard: "POST /api/generate-newsletter with categories",
      generate_personalized: "POST /api/generate-newsletter with categories + userPreferences + personalized: true",
      generate_location: "POST /api/generate-newsletter with categories + location",
    },
  })
}
