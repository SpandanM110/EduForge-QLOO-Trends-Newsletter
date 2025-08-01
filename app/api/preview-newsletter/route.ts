import { type NextRequest, NextResponse } from "next/server"
import { newsletterGenerator } from "@/lib/newsletter-generator"

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log("⚠️ GEMINI_API_KEY not found, using fallback content")
      return NextResponse.json({
        success: true,
        articles: [
          {
            title: "AI-Powered Content Generation",
            content: `The future of content creation is here, powered by artificial intelligence and real-time data analysis. Modern newsletter systems combine multiple data sources to create personalized, engaging content that resonates with diverse audiences.

AI-driven content generation represents a significant leap forward in how we consume and interact with information. By analyzing trending topics, user preferences, and cultural patterns, these systems can produce articles that feel both timely and relevant to individual readers.

The integration of APIs like Qloo with advanced language models creates a powerful synergy. Qloo provides real-time insights into entertainment trends, cultural movements, and audience preferences, while AI models transform this raw data into compelling narratives that inform and engage.

This approach to content creation isn't just about automation—it's about augmentation. The technology enhances human creativity and insight, allowing for more personalized and relevant content delivery at scale. As these systems continue to evolve, we can expect even more sophisticated and nuanced content generation capabilities.`,
            category: "Technology",
            trending: true,
            source_data: { entity_id: "ai-content", name: "AI Content", type: "technology" },
            read_time: "3 min read",
            excerpt: "Exploring how AI and real-time data are revolutionizing content creation and personalization.",
            tags: ["AI", "content-generation", "technology", "automation"],
            image_url: "/placeholder.svg?height=400&width=600",
          },
          {
            title: "The Evolution of Digital Entertainment",
            content: `Digital entertainment has undergone a remarkable transformation over the past decade, reshaping how we discover, consume, and interact with media content. Streaming platforms have become the dominant force, offering unprecedented access to diverse content from around the globe.

The rise of algorithm-driven recommendations has fundamentally changed content discovery. Platforms now use sophisticated machine learning models to analyze viewing patterns, preferences, and even the time of day to suggest content that matches individual tastes and moods.

Social media integration has created new forms of entertainment consumption, where content is not just watched but discussed, shared, and remixed across platforms. This has led to the emergence of viral phenomena and the democratization of content creation, where anyone can become a creator and build an audience.

Looking ahead, emerging technologies like virtual reality, augmented reality, and interactive storytelling promise to further revolutionize the entertainment landscape. These innovations will create more immersive and personalized entertainment experiences than ever before.`,
            category: "Entertainment",
            trending: true,
            source_data: { entity_id: "digital-entertainment", name: "Digital Entertainment", type: "entertainment" },
            read_time: "4 min read",
            excerpt: "How streaming, social media, and emerging technologies are reshaping the entertainment industry.",
            tags: ["streaming", "entertainment", "digital-media", "technology"],
            image_url: "/placeholder.svg?height=400&width=600",
          },
          {
            title: "Cultural Trends in the Digital Age",
            content: `The digital age has accelerated the pace of cultural change, creating new forms of expression and community that transcend geographical boundaries. Social media platforms have become the primary drivers of cultural trends, with viral content shaping global conversations and movements.

The creator economy has emerged as a significant cultural force, empowering individuals to build personal brands and businesses around their unique perspectives and talents. This shift represents more than just new career paths—it reflects a broader change in how we value authenticity and personal connection in an increasingly digital world.

Digital culture has also democratized influence, allowing voices that might have been marginalized in traditional media to find audiences and create impact. This has led to more diverse representation in entertainment, fashion, and other cultural spheres.

The intersection of technology and culture continues to evolve, with emerging platforms and tools constantly reshaping how we interact and express ourselves. Understanding these digital cultural currents has become essential for anyone seeking to navigate our interconnected world.`,
            category: "Culture",
            trending: false,
            source_data: { entity_id: "digital-culture", name: "Digital Culture", type: "culture" },
            read_time: "3 min read",
            excerpt: "Examining how digital platforms are reshaping cultural expression and community building.",
            tags: ["culture", "social-media", "creator-economy", "digital-trends"],
            image_url: "/placeholder.svg?height=400&width=600",
          },
        ],
        generated_at: new Date().toISOString(),
        total_articles: 3,
        is_preview: true,
        fallback: true,
      })
    }

    console.log("🎬 Generating preview newsletter content...")

    // Generate a diverse mix for preview - one from each major category
    const previewCategories = ["artists", "trends", "movies"]

    try {
      const result = await newsletterGenerator.generateNewsletterContentWithDB(previewCategories)

      console.log(`✅ Generated ${result.articles.length} preview articles`)

      return NextResponse.json({
        success: true,
        articles: result.articles.slice(0, 3), // Limit to 3 for preview
        newsletter: result.newsletter,
        generated_at: new Date().toISOString(),
        total_articles: result.articles.length,
        is_preview: true,
      })
    } catch (generationError) {
      console.log("⚠️ Generation failed, using fallback content")

      return NextResponse.json({
        success: true,
        articles: [
          {
            title: "Content Generation in Progress",
            content:
              "Our AI is currently generating fresh content from the latest trends. The system combines real-time data from Qloo API with advanced AI processing to create engaging, personalized articles about music, entertainment, and cultural trends. Please check back in a moment for live updates.",
            category: "System Update",
            trending: false,
            source_data: { entity_id: "preview", name: "Preview", type: "system" },
            read_time: "1 min read",
            excerpt: "Live content is being generated from current trends and entertainment data.",
            tags: ["preview", "live-content", "qloo-api"],
            image_url: "/placeholder.svg?height=400&width=600",
          },
        ],
        generated_at: new Date().toISOString(),
        total_articles: 1,
        is_preview: true,
        fallback: true,
      })
    }
  } catch (error) {
    console.error("❌ Error generating preview newsletter:", error)

    // Return fallback content instead of error
    return NextResponse.json({
      success: true,
      articles: [
        {
          title: "Live Content Loading...",
          content:
            "We're fetching the latest trends and entertainment insights. Our AI-powered system is analyzing current data from music, movies, and cultural trends to bring you the most relevant content. The system combines Qloo's real-time trend data with advanced AI content generation to create personalized, engaging articles.",
          category: "Loading",
          trending: true,
          source_data: { entity_id: "loading", name: "Loading", type: "system" },
          read_time: "2 min read",
          excerpt: "Fresh content is being generated from live trend data and entertainment insights.",
          tags: ["live", "trends", "entertainment"],
          image_url: "/placeholder.svg?height=400&width=600",
        },
      ],
      generated_at: new Date().toISOString(),
      total_articles: 1,
      is_preview: true,
      fallback: true,
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { categories } = await request.json()

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json({ error: "Categories array is required" }, { status: 400 })
    }

    console.log("🎯 Generating custom preview for categories:", categories)

    try {
      const result = await newsletterGenerator.generateNewsletterContentWithDB(categories)

      return NextResponse.json({
        success: true,
        articles: result.articles.slice(0, 3),
        newsletter: result.newsletter,
        generated_at: new Date().toISOString(),
        total_articles: result.articles.length,
        is_preview: true,
        categories: categories,
      })
    } catch (generationError) {
      console.error("Generation error:", generationError)
      throw generationError
    }
  } catch (error) {
    console.error("❌ Error generating custom preview:", error)
    return NextResponse.json(
      {
        error: "Failed to generate preview",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
