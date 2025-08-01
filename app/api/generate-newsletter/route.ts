import { type NextRequest, NextResponse } from "next/server"
import { newsletterGenerator } from "@/lib/newsletter-generator"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY environment variable is required" }, { status: 500 })
    }

    const { categories, userPreferences, location, personalized = false, weekOf } = await request.json()

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json({ error: "Categories array is required" }, { status: 400 })
    }

    console.log("🚀 Generating newsletter with options:", {
      categories,
      personalized,
      location,
      hasPreferences: !!userPreferences,
      weekOf,
    })

    let result

    if (location) {
      // Generate location-based newsletter
      result = await newsletterGenerator.generateLocationBasedNewsletterWithDB(location, categories, weekOf)
    } else if (personalized && userPreferences) {
      // Generate personalized newsletter
      result = await newsletterGenerator.generatePersonalizedNewsletterWithDB(categories, userPreferences, weekOf)
    } else {
      // Generate standard newsletter
      result = await newsletterGenerator.generateNewsletterContentWithDB(categories, weekOf)
    }

    console.log(`✅ Generated ${result.articles.length} articles`)

    return NextResponse.json({
      success: true,
      articles: result.articles,
      newsletter: result.newsletter,
      generated_at: new Date().toISOString(),
      total_articles: result.articles.length,
      generation_type: location ? "location-based" : personalized ? "personalized" : "standard",
      saved_to_db: true,
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
    message: "Advanced Newsletter Generation API with Integrated Database Storage",
    features: [
      "Standard newsletter generation with automatic DB storage",
      "Personalized recommendations based on user preferences",
      "Location-based content recommendations",
      "Demographic insights integration",
      "Advanced Qloo Insights API integration",
      "Automatic database persistence in newsletter generator",
      "Newsletter deduplication and caching",
      "HTML content generation for email sending",
    ],
    endpoints: {
      generate_standard: "POST /api/generate-newsletter with categories",
      generate_personalized: "POST /api/generate-newsletter with categories + userPreferences + personalized: true",
      generate_location: "POST /api/generate-newsletter with categories + location",
      generate_for_week: "POST /api/generate-newsletter with categories + weekOf (ISO date string)",
    },
    request_body: {
      categories: "string[] - Required array of category names",
      userPreferences: "object - Optional user preferences for personalization",
      location: "string - Optional location for location-based content",
      personalized: "boolean - Set to true for personalized content",
      weekOf: "string - Optional ISO date string to specify newsletter week (defaults to current week)",
    },
    response: {
      success: "boolean",
      articles: "array - Generated newsletter articles",
      newsletter: "object - Database newsletter record with ID and metadata",
      total_articles: "number",
      generation_type: "string - standard|personalized|location-based",
      saved_to_db: "boolean - Always true (saved in generator)",
    },
    notes: [
      "Newsletter generation and database storage happen together in the generator",
      "Duplicate newsletters for same categories/week are automatically detected",
      "HTML content is pre-generated and stored for immediate email sending",
    ],
  })
}
