import { qlooService, type QlooEntity } from "./qloo-service"
import { GoogleGenAI } from "@google/genai"
import { prisma } from "./prisma"
import { generateNewsletterEmailHTML } from "./email-template"

export interface NewsletterArticle {
  title: string
  content: string
  category: string
  image_url?: string
  trending: boolean
  source_data: QlooEntity
  affinity_score?: number
  demographic_insights?: string
  read_time: string
  excerpt: string
  tags: string[]
}

export interface UserPreferences {
  location?: string
  demographics?: string[]
  interests?: string[]
  tags?: string[]
}

export interface NewsletterGenerationResult {
  articles: NewsletterArticle[]
  newsletter: {
    id: string
    title: string
    subtitle?: string
    weekOf: Date
    categories: string[]
    htmlContent: string
    isExisting?: boolean
  }
}

export class NewsletterGenerator {
  private ai: GoogleGenAI

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "your-gemini-api-key-here",
    })
  }

  // NEW: Database-integrated newsletter generation
  async generateNewsletterContentWithDB(categories: string[], weekOf?: string): Promise<NewsletterGenerationResult> {
    const targetWeek = weekOf ? new Date(weekOf) : this.getCurrentWeekStart()
    const sortedCategories = [...categories].sort()

    console.log(
      `📰 Generating newsletter for week ${targetWeek.toISOString()}, categories: ${sortedCategories.join(", ")}`,
    )

    // Check if newsletter already exists
    const existingNewsletter = await prisma.newsletter.findFirst({
      where: {
        weekOf: targetWeek,
        categories: {
          equals: sortedCategories,
        },
      },
    })

    if (existingNewsletter) {
      console.log(`✅ Found existing newsletter: ${existingNewsletter.id}`)
      return {
        articles: existingNewsletter.articles as NewsletterArticle[],
        newsletter: {
          id: existingNewsletter.id,
          title: existingNewsletter.title,
          subtitle: existingNewsletter.subtitle || undefined,
          weekOf: existingNewsletter.weekOf,
          categories: existingNewsletter.categories,
          htmlContent: existingNewsletter.htmlContent,
          isExisting: true,
        },
      }
    }

    // Generate new newsletter content
    console.log(`🔨 Creating new newsletter for categories: ${sortedCategories.join(", ")}`)
    const articles = await this.generatePersonalizedNewsletter(categories)

    if (articles.length === 0) {
      throw new Error("Failed to generate newsletter articles")
    }

    // Create newsletter title
    const title = this.generateNewsletterTitle(categories, targetWeek)
    const subtitle = this.generateNewsletterSubtitle(categories)

    // Generate HTML content
    const htmlContent = generateNewsletterEmailHTML(articles, "Newsletter Subscriber")

    // Save to database
    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        subtitle,
        weekOf: targetWeek,
        categories: sortedCategories,
        articles: articles as any, // Prisma Json type
        htmlContent,
      },
    })

    console.log(`✅ Created newsletter: ${newsletter.id} with ${articles.length} articles`)

    return {
      articles,
      newsletter: {
        id: newsletter.id,
        title: newsletter.title,
        subtitle: newsletter.subtitle || undefined,
        weekOf: newsletter.weekOf,
        categories: newsletter.categories,
        htmlContent: newsletter.htmlContent,
        isExisting: false,
      },
    }
  }

  // NEW: Personalized newsletter with database integration
  async generatePersonalizedNewsletterWithDB(
    categories: string[],
    userPreferences?: UserPreferences,
    weekOf?: string,
  ): Promise<NewsletterGenerationResult> {
    // For personalized newsletters, we don't cache since they're user-specific
    const articles = await this.generatePersonalizedNewsletter(categories, userPreferences)
    const targetWeek = weekOf ? new Date(weekOf) : this.getCurrentWeekStart()

    const title = this.generatePersonalizedNewsletterTitle(categories, targetWeek)
    const subtitle = "Personalized insights based on your preferences"
    const htmlContent = generateNewsletterEmailHTML(articles, "Valued Subscriber")

    // Save personalized newsletter (these are typically not cached)
    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        subtitle,
        weekOf: targetWeek,
        categories: [...categories].sort(),
        articles: articles as any,
        htmlContent,
      },
    })

    return {
      articles,
      newsletter: {
        id: newsletter.id,
        title: newsletter.title,
        subtitle: newsletter.subtitle || undefined,
        weekOf: newsletter.weekOf,
        categories: newsletter.categories,
        htmlContent: newsletter.htmlContent,
        isExisting: false,
      },
    }
  }

  // NEW: Location-based newsletter with database integration
  async generateLocationBasedNewsletterWithDB(
    location: string,
    categories: string[],
    weekOf?: string,
  ): Promise<NewsletterGenerationResult> {
    const articles = await this.generateLocationBasedNewsletter(location, categories)
    const targetWeek = weekOf ? new Date(weekOf) : this.getCurrentWeekStart()

    const title = `${location} Trends: ${this.generateNewsletterTitle(categories, targetWeek)}`
    const subtitle = `Location-based insights for ${location}`
    const htmlContent = generateNewsletterEmailHTML(articles, "Local Subscriber")

    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        subtitle,
        weekOf: targetWeek,
        categories: [...categories].sort(),
        articles: articles as any,
        htmlContent,
      },
    })

    return {
      articles,
      newsletter: {
        id: newsletter.id,
        title: newsletter.title,
        subtitle: newsletter.subtitle || undefined,
        weekOf: newsletter.weekOf,
        categories: newsletter.categories,
        htmlContent: newsletter.htmlContent,
        isExisting: false,
      },
    }
  }

  // Helper methods for title generation
  private generateNewsletterTitle(categories: string[], weekOf: Date): string {
    const weekStr = weekOf.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const categoryStr = categories.length === 1 ? this.formatCategory(categories[0]) : `${categories.length} Categories`

    return `🎵 ${categoryStr} Trends - Week of ${weekStr}`
  }

  private generatePersonalizedNewsletterTitle(categories: string[], weekOf: Date): string {
    const weekStr = weekOf.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    return `🎯 Your Personalized Trends - Week of ${weekStr}`
  }

  private generateNewsletterSubtitle(categories: string[]): string {
    const categoryNames = categories.map((cat) => this.formatCategory(cat)).join(", ")
    return `Latest insights in ${categoryNames}`
  }

  private getCurrentWeekStart(): Date {
    const now = new Date()
    const day = now.getDay()
    const diff = day === 0 ? -6 : 1 - day // Monday is start of week
    const monday = new Date(now.getTime() + diff * 24 * 60 * 60 * 1000)
    monday.setHours(0, 0, 0, 0)
    return monday
  }

  // EXISTING METHODS (keeping all the original functionality)
  async generatePersonalizedNewsletter(
    categories: string[],
    userPreferences?: UserPreferences,
  ): Promise<NewsletterArticle[]> {
    const articles: NewsletterArticle[] = []

    console.log(`📝 Generating premium newsletter for categories: ${categories.join(", ")}`)

    for (const category of categories.slice(0, 3)) {
      try {
        console.log(`🎯 Processing category: ${category}`)

        const entities = await qlooService.getTrendingByCategory(category, userPreferences)
        console.log(`📊 Found ${entities.length} entities for ${category}`)

        if (entities.length > 0) {
          // Pick the top entity with highest affinity score
          const topEntity = entities.sort((a, b) => (b.affinity_score || 0) - (a.affinity_score || 0))[0]
          console.log(`🏆 Selected entity: ${topEntity.name} for ${category}`)

          // Get demographic insights for this entity
          let demographics: any[] = []
          try {
            const demographicResult = await qlooService.getDemographicInsights(topEntity.entity_id)
            demographics = Array.isArray(demographicResult) ? demographicResult : []
            console.log(`📈 Got ${demographics.length} demographic insights for ${topEntity.name}`)
          } catch (demoError) {
            console.log(`⚠️ Could not get demographics for ${topEntity.name}:`, demoError)
            demographics = []
          }

          const article = await this.generatePremiumArticle(topEntity, category, demographics)
          articles.push(article)
          console.log(`✅ Generated premium article: "${article.title}" (${article.read_time})`)
        } else {
          console.log(`⚠️ No entities found for category: ${category}`)
          const fallbackArticle = await this.createPremiumFallbackArticle(category)
          articles.push(fallbackArticle)
          console.log(`🔄 Created premium fallback article for ${category}`)
        }
      } catch (error) {
        console.error(`❌ Error generating article for category ${category}:`, error)
        const errorArticle = await this.createPremiumFallbackArticle(category)
        articles.push(errorArticle)
      }
    }

    console.log(`🎉 Premium newsletter generation complete: ${articles.length} articles created`)
    return articles
  }

  async generateLocationBasedNewsletter(location: string, categories: string[]): Promise<NewsletterArticle[]> {
    const articles: NewsletterArticle[] = []

    for (const category of categories.slice(0, 3)) {
      try {
        let filterType: string
        switch (category) {
          case "artists":
            filterType = "urn:entity:artist"
            break
          case "movies":
            filterType = "urn:entity:movie"
            break
          case "trends":
            filterType = "urn:entity:movie"
            break
          default:
            filterType = "urn:entity:movie"
        }

        const entities = await qlooService.getLocationBasedInsights(filterType, location, { limit: 5 })

        if (entities.length > 0) {
          const entity = entities[0]
          const article = await this.generateLocationAwareArticle(entity, category, location)
          articles.push(article)
        }
      } catch (error) {
        console.error(`Error generating location-based article for ${category}:`, error)
      }
    }

    return articles
  }

  private async generatePremiumArticle(
    entity: QlooEntity,
    category: string,
    demographics: any[],
  ): Promise<NewsletterArticle> {
    const safeDemographics = Array.isArray(demographics) ? demographics : []
    const demographicInsight = this.analyzeDemographics(safeDemographics)

    // Enhanced prompt for longer, more engaging content
    const prompt = `
Write a comprehensive, engaging newsletter article about ${entity.name} in the ${category} category.

Entity Information:
- Name: ${entity.name}
- Type: ${entity.type}
- Description: ${entity.description || "Popular entertainment entity"}
- Affinity Score: ${entity.affinity_score || "N/A"}

Demographic Insights: ${demographicInsight}

REQUIREMENTS FOR PREMIUM CONTENT:
- Write 400-600 words (2+ minute read)
- Create an engaging hook in the first paragraph
- Include 3-4 main sections with clear narrative flow
- Add specific details, statistics, or interesting facts
- Include quotes or expert opinions (you can create realistic ones)
- Discuss cultural impact and why this matters now
- End with forward-looking insights or predictions
- Write in an engaging, journalistic style
- Remove all markdown formatting and special characters
- Make it feel like premium magazine content

STRUCTURE:
1. Hook/Opening (why this matters right now)
2. Background/Context (what makes this significant)
3. Current Impact (how it's affecting culture/industry)
4. Audience Appeal (why people are drawn to this)
5. Future Outlook (what to expect next)

Write as if for a sophisticated audience who wants depth and insight, not just surface-level information.
Do not use markdown formatting, bullet points, or special characters in your response.
`

    try {
      const model = "gemini-2.0-flash-lite"
      const contents = [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ]

      const response = await this.ai.models.generateContentStream({
        model,
        contents,
      })

      let generatedText = ""
      for await (const chunk of response) {
        if (chunk.text) {
          generatedText += chunk.text
        }
      }

      const cleanedContent = this.cleanContent(generatedText)
      const wordCount = cleanedContent.split(" ").length
      const readTime = Math.max(2, Math.ceil(wordCount / 200)) // Assume 200 words per minute

      return {
        title: this.generatePremiumTitle(entity.name, category, entity.affinity_score),
        content: cleanedContent,
        excerpt: this.generateExcerpt(cleanedContent),
        category: this.formatCategory(category),
        image_url: this.generateReliableImage(category),
        trending: (entity.affinity_score || 0) > 0.7,
        source_data: entity,
        affinity_score: entity.affinity_score,
        demographic_insights: demographicInsight,
        read_time: `${readTime} min read`,
        tags: this.generateTags(entity, category),
      }
    } catch (error) {
      console.error("Error generating premium article:", error)
      return this.createPremiumFallbackArticle(category, entity)
    }
  }

  private async generateLocationAwareArticle(
    entity: QlooEntity,
    category: string,
    location: string,
  ): Promise<NewsletterArticle> {
    const prompt = `
Write a comprehensive, location-focused newsletter article about ${entity.name} in the ${category} category.

Entity Information:
- Name: ${entity.name}
- Type: ${entity.type}
- Location Context: Popular in ${location}
- Affinity Score: ${entity.affinity_score || "N/A"}

REQUIREMENTS FOR PREMIUM LOCATION-BASED CONTENT:
- Write 400-600 words (2+ minute read)
- Focus heavily on local relevance and cultural context in ${location}
- Include specific details about local popularity or impact
- Discuss how this fits into ${location}'s cultural landscape
- Add insights about regional preferences and trends
- Include local statistics or cultural references where relevant
- Write in an engaging, journalistic style
- Remove all markdown formatting and special characters

STRUCTURE:
1. Local Hook (why this is big in ${location} right now)
2. Regional Context (how it fits into local culture)
3. Local Impact (specific effects in ${location})
4. Community Response (how locals are engaging)
5. Broader Implications (what this means for the region)

Write as premium content for readers interested in ${location}'s cultural scene.
Do not use markdown formatting, bullet points, or special characters.
`

    try {
      const model = "gemini-2.0-flash-lite"
      const contents = [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ]

      const response = await this.ai.models.generateContentStream({
        model,
        contents,
      })

      let generatedText = ""
      for await (const chunk of response) {
        if (chunk.text) {
          generatedText += chunk.text
        }
      }

      const cleanedContent = this.cleanContent(generatedText)
      const wordCount = cleanedContent.split(" ").length
      const readTime = Math.max(2, Math.ceil(wordCount / 200))

      return {
        title: `${location} Spotlight: ${this.generateLocationTitle(entity.name, location)}`,
        content: cleanedContent,
        excerpt: this.generateExcerpt(cleanedContent),
        category: this.formatCategory(category),
        image_url: this.generateReliableImage(category),
        trending: (entity.affinity_score || 0) > 0.6,
        source_data: entity,
        affinity_score: entity.affinity_score,
        demographic_insights: `Trending in ${location}`,
        read_time: `${readTime} min read`,
        tags: this.generateLocationTags(entity, category, location),
      }
    } catch (error) {
      console.error("Error generating location-aware article:", error)
      return this.createPremiumFallbackArticle(category, entity)
    }
  }

  // BULLETPROOF: Generate images using only SVG data URLs (guaranteed to work)
  private generateReliableImage(category: string): string {
    console.log(`🎨 Generating bulletproof SVG image for category: ${category}`)

    // Simplified category-specific configurations (no special characters)
    const categoryConfig = {
      artists: {
        primaryColor: "#EC4899",
        secondaryColor: "#F97316",
        bgColor: "#FDF2F8",
        accentColor: "#BE185D",
        icon: "♪",
        label: "MUSIC",
        subtitle: "Trending Sounds",
      },
      "music & artists": {
        primaryColor: "#EC4899",
        secondaryColor: "#F97316",
        bgColor: "#FDF2F8",
        accentColor: "#BE185D",
        icon: "♪",
        label: "MUSIC",
        subtitle: "Trending Sounds",
      },
      trends: {
        primaryColor: "#10B981",
        secondaryColor: "#06B6D4",
        bgColor: "#ECFDF5",
        accentColor: "#059669",
        icon: "📈",
        label: "TRENDS",
        subtitle: "What's Hot Now",
      },
      "global trends": {
        primaryColor: "#10B981",
        secondaryColor: "#06B6D4",
        bgColor: "#ECFDF5",
        accentColor: "#059669",
        icon: "📈",
        label: "TRENDS",
        subtitle: "What's Hot Now",
      },
      movies: {
        primaryColor: "#7C3AED",
        secondaryColor: "#EC4899",
        bgColor: "#F5F3FF",
        accentColor: "#5B21B6",
        icon: "🎬",
        label: "MOVIES",
        subtitle: "Box Office Hits",
      },
      "cinema & film": {
        primaryColor: "#7C3AED",
        secondaryColor: "#EC4899",
        bgColor: "#F5F3FF",
        accentColor: "#5B21B6",
        icon: "🎬",
        label: "MOVIES",
        subtitle: "Box Office Hits",
      },
      books: {
        primaryColor: "#DC2626",
        secondaryColor: "#EA580C",
        bgColor: "#FEF2F2",
        accentColor: "#B91C1C",
        icon: "📚",
        label: "BOOKS",
        subtitle: "Must-Read Stories",
      },
      "literature & books": {
        primaryColor: "#DC2626",
        secondaryColor: "#EA580C",
        bgColor: "#FEF2F2",
        accentColor: "#B91C1C",
        icon: "📚",
        label: "BOOKS",
        subtitle: "Must-Read Stories",
      },
      tv_shows: {
        primaryColor: "#059669",
        secondaryColor: "#0891B2",
        bgColor: "#ECFDF5",
        accentColor: "#047857",
        icon: "📺",
        label: "TV",
        subtitle: "Binge-Worthy Series",
      },
      "television & streaming": {
        primaryColor: "#059669",
        secondaryColor: "#0891B2",
        bgColor: "#ECFDF5",
        accentColor: "#047857",
        icon: "📺",
        label: "TV",
        subtitle: "Binge-Worthy Series",
      },
    }

    const config = categoryConfig[category.toLowerCase() as keyof typeof categoryConfig] || {
      primaryColor: "#6366F1",
      secondaryColor: "#8B5CF6",
      bgColor: "#F8FAFC",
      accentColor: "#4F46E5",
      icon: "✨",
      label: "CONTENT",
      subtitle: "Premium Insights",
    }

    // Create a clean, simple SVG that will definitely work
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${config.bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${config.primaryColor};stop-opacity:0.1" />
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${config.primaryColor};stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:${config.secondaryColor};stop-opacity:0.7" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="${config.accentColor}" flood-opacity="0.2"/>
        </filter>
      </defs>
      
      <rect width="600" height="400" fill="url(#bg)"/>
      
      <circle cx="120" cy="100" r="50" fill="${config.primaryColor}" opacity="0.08"/>
      <circle cx="480" cy="300" r="70" fill="${config.secondaryColor}" opacity="0.06"/>
      
      <rect x="0" y="0" width="600" height="10" fill="url(#accent)"/>
      
      <rect x="50" y="80" width="500" height="240" rx="20" fill="white" fill-opacity="0.3" stroke="${config.primaryColor}" stroke-width="1" stroke-opacity="0.2"/>
      
      <circle cx="300" cy="180" r="40" fill="white" fill-opacity="0.9" filter="url(#shadow)"/>
      <circle cx="300" cy="180" r="35" fill="${config.primaryColor}" opacity="0.1"/>
      
      <text x="300" y="195" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="${config.primaryColor}">${config.icon}</text>
      
      <text x="300" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="${config.primaryColor}" letter-spacing="1px">${config.label}</text>
      
      <text x="300" y="265" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="${config.accentColor}" opacity="0.8">${config.subtitle}</text>
      
      <rect x="230" y="280" width="140" height="20" rx="10" fill="${config.primaryColor}" opacity="0.1"/>
      <text x="300" y="293" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="600" fill="${config.accentColor}">PREMIUM CONTENT</text>
      
      <rect x="0" y="390" width="600" height="10" fill="url(#accent)" opacity="0.8"/>
    </svg>`

    // Use proper URL encoding for the SVG
    const encodedSvg = encodeURIComponent(svgContent)
    const dataUrl = `data:image/svg+xml,${encodedSvg}`

    console.log(`✅ Generated bulletproof SVG for ${category}`)
    console.log(`🎨 Colors: ${config.primaryColor} → ${config.secondaryColor}`)

    return dataUrl
  }

  private async createPremiumFallbackArticle(category: string, entity?: QlooEntity): Promise<NewsletterArticle> {
    const categoryContent = {
      artists: {
        title: "The Evolution of Music in the Digital Age",
        content: `The music industry continues to undergo unprecedented transformation as digital platforms reshape how artists connect with audiences worldwide. Streaming services have democratized music discovery, allowing independent artists to reach global audiences without traditional gatekeepers. This shift has created new opportunities for diverse voices and genres to flourish.

Social media platforms like TikTok have become the new radio, with 15-second clips determining which songs become viral hits. Artists now craft their music with these platforms in mind, creating hooks designed for maximum shareability. The result is a more dynamic, fast-paced music landscape where trends can emerge and evolve within days rather than months.

The rise of playlist culture has also changed how we consume music. Curated playlists for every mood, activity, and moment have replaced traditional album listening experiences. This has influenced how artists structure their releases, with many opting for frequent single drops rather than full album cycles.

Looking ahead, emerging technologies like AI-generated music and virtual concerts are poised to further revolutionize the industry. As artists continue to adapt to these changes, we can expect even more innovative approaches to music creation and distribution in the coming years.`,
        imageQuery: "music streaming digital transformation artist microphone studio modern",
      },
      trends: {
        title: "Digital Culture Shapes Tomorrow's World",
        content: `We are witnessing a fundamental shift in how global culture is created, shared, and consumed. Digital platforms have become the primary drivers of cultural trends, with social media algorithms determining what captures collective attention. This democratization of influence has given rise to new forms of creativity and expression that transcend traditional boundaries.

The creator economy has emerged as a significant force, with individuals building personal brands and businesses around their unique perspectives and talents. This shift represents more than just new career paths; it reflects a broader change in how we value authenticity and personal connection in an increasingly digital world.

Viral phenomena now spread across continents in hours, creating shared global experiences that unite diverse communities around common interests. From dance challenges to social movements, digital culture has proven its power to mobilize and inspire action on unprecedented scales.

The intersection of technology and culture continues to evolve, with emerging platforms and tools constantly reshaping how we interact and express ourselves. As we move forward, understanding these digital cultural currents becomes essential for anyone seeking navigate our interconnected world.`,
        imageQuery: "digital culture social media technology viral trends modern colorful",
      },
      movies: {
        title: "Cinema's Renaissance in the Streaming Era",
        content: `The film industry is experiencing a remarkable renaissance as streaming platforms invest billions in original content, creating unprecedented opportunities for diverse storytelling. This shift has democratized film distribution, allowing independent filmmakers and international cinema to reach global audiences without traditional theatrical gatekeepers.

Streaming services have also changed audience expectations, with viewers now accustomed to binge-watching entire series and having instant access to vast libraries of content. This has influenced how filmmakers approach storytelling, with many embracing serialized narratives and experimental formats that wouldn't have been viable in traditional cinema.

The pandemic accelerated these changes, forcing the industry to reimagine release strategies and production methods. Simultaneous streaming and theatrical releases became the norm, while virtual film festivals opened new avenues for discovery and distribution.

International content has found unprecedented success on global platforms, with non-English films and series achieving mainstream popularity. This cultural exchange has enriched the global entertainment landscape and created new opportunities for cross-cultural collaboration and understanding.`,
        imageQuery: "cinema movie theater film streaming platform popcorn premiere",
      },
      books: {
        title: "The Literary Landscape in Digital Times",
        content: `The publishing world is undergoing a digital transformation that's reshaping how we discover, consume, and discuss literature. Social media platforms like BookTok have become powerful forces in book marketing, with young readers driving bestseller lists through viral recommendations and creative content.

E-books and audiobooks have expanded access to literature, making reading more convenient and accessible than ever before. The rise of audiobook popularity has also created new opportunities for authors and narrators, with some books specifically designed for audio consumption.

Self-publishing platforms have democratized the publishing process, allowing authors to reach readers directly without traditional gatekeepers. This has led to more diverse voices and genres finding their audiences, particularly in romance, fantasy, and other genre fiction categories.

Book clubs and reading communities have flourished online, creating global conversations around literature that transcend geographical boundaries. These digital communities have become influential in shaping reading trends and supporting both established and emerging authors.`,
        imageQuery: "books literature reading library cozy aesthetic digital publishing",
      },
      tv_shows: {
        title: "Television's Golden Age Continues to Evolve",
        content: `We are living through an unprecedented era of television excellence, with streaming platforms and traditional networks investing heavily in high-quality, diverse programming. This golden age has been characterized by complex narratives, cinematic production values, and bold creative risks that have elevated television to new artistic heights.

The proliferation of streaming services has created intense competition for viewer attention, resulting in increased investment in original programming and talent. This has led to more opportunities for underrepresented voices and experimental storytelling formats that might not have found homes in traditional television.

International content has gained remarkable traction on global platforms, with series from Korea, Spain, Germany, and other countries achieving worldwide success. This cultural exchange has enriched the global television landscape and demonstrated the universal appeal of compelling storytelling.

The binge-watching phenomenon has fundamentally changed how series are structured and consumed, with creators now able to craft longer narrative arcs and more complex character development. This shift has blurred the lines between television and cinema, creating new hybrid forms of entertainment.`,
        imageQuery: "television streaming TV show production set modern entertainment",
      },
    }

    const content = categoryContent[category as keyof typeof categoryContent] || categoryContent.trends
    const wordCount = content.content.split(" ").length
    const readTime = Math.max(2, Math.ceil(wordCount / 200))

    return {
      title: content.title,
      content: content.content,
      excerpt: this.generateExcerpt(content.content),
      category: this.formatCategory(category),
      image_url: this.generateReliableImage(category),
      trending: true,
      source_data:
        entity ||
        ({
          entity_id: `fallback-${category}`,
          name: content.title,
          type: category,
        } as QlooEntity),
      read_time: `${readTime} min read`,
      tags: this.generateFallbackTags(category),
    }
  }

  private generateExcerpt(content: string): string {
    const sentences = content.split(". ")
    const excerpt = sentences.slice(0, 2).join(". ")
    return excerpt.length > 150 ? excerpt.substring(0, 147) + "..." : excerpt + "."
  }

  private generateTags(entity: QlooEntity, category: string): string[] {
    const baseTags = [category, "trending", "culture"]

    switch (category) {
      case "artists":
        return [...baseTags, "music", "entertainment", "streaming"]
      case "trends":
        return [...baseTags, "social media", "digital culture", "viral"]
      case "movies":
        return [...baseTags, "cinema", "film", "entertainment"]
      case "books":
        return [...baseTags, "literature", "reading", "publishing"]
      case "tv_shows":
        return [...baseTags, "television", "streaming", "series"]
      default:
        return baseTags
    }
  }

  private generateLocationTags(entity: QlooEntity, category: string, location: string): string[] {
    const baseTags = this.generateTags(entity, category)
    return [...baseTags, location.toLowerCase(), "local trends", "regional culture"]
  }

  private generateFallbackTags(category: string): string[] {
    return this.generateTags({} as QlooEntity, category)
  }

  private generatePremiumTitle(name: string, category: string, affinityScore?: number): string {
    const isHighAffinity = (affinityScore || 0) > 0.8

    if (isHighAffinity) {
      const premiumTitles = {
        artists: [
          `${name}: The Cultural Phenomenon Reshaping Music`,
          `Inside ${name}'s Rise to Global Stardom`,
          `How ${name} is Redefining Modern Entertainment`,
          `${name}: The Artist Everyone's Talking About`,
        ],
        movies: [
          `${name}: The Film That's Captivating Global Audiences`,
          `Why ${name} Represents Cinema's New Direction`,
          `${name}: A Cultural Moment in Modern Film`,
          `The ${name} Phenomenon: What It Means for Hollywood`,
        ],
        trends: [
          `The ${name} Revolution: Understanding Today's Digital Culture`,
          `${name}: How One Trend is Shaping Global Conversations`,
          `Inside the ${name} Movement That's Changing Everything`,
          `${name}: The Cultural Shift You Need to Understand`,
        ],
        books: [
          `${name}: The Literary Sensation Captivating Readers Worldwide`,
          `Why ${name} is More Than Just a Bestseller`,
          `${name}: The Book That's Redefining Modern Literature`,
          `Inside the ${name} Phenomenon That's Changing Publishing`,
        ],
        tv_shows: [
          `${name}: The Series That's Redefining Television Excellence`,
          `Why ${name} Represents the Future of Streaming Content`,
          `${name}: The Show Everyone's Binge-Watching Right Now`,
          `Inside ${name}: The Series That's Breaking All the Rules`,
        ],
      }

      const titles = premiumTitles[category as keyof typeof premiumTitles] || premiumTitles.trends
      return titles[Math.floor(Math.random() * titles.length)]
    }

    return this.generateTitle(name, category)
  }

  private generateLocationTitle(name: string, location: string): string {
    const templates = [
      `How ${name} is Taking ${location} by Storm`,
      `${name}'s Cultural Impact in ${location}`,
      `Why ${location} Can't Stop Talking About ${name}`,
      `${name}: The ${location} Cultural Phenomenon`,
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  }

  // Keep all existing helper methods...
  private analyzeDemographics(demographics: any[]): string {
    if (!demographics || !Array.isArray(demographics) || demographics.length === 0) {
      return "Appeals to a broad, diverse audience across multiple demographics and cultural segments."
    }

    const topDemographics = demographics
      .filter((demo) => demo && typeof demo === "object" && demo.name)
      .sort((a, b) => (b.affinity_score || 0) - (a.affinity_score || 0))
      .slice(0, 3)

    if (topDemographics.length === 0) {
      return "Resonates strongly with diverse audience segments across various cultural and demographic groups."
    }

    const insights = topDemographics.map(
      (demo) => `${demo.name} (${Math.round((demo.affinity_score || 0) * 100)}% affinity)`,
    )

    return `Particularly resonates with: ${insights.join(", ")}. This broad appeal demonstrates its cross-cultural significance.`
  }

  private generateTitle(name: string, category: string): string {
    const titleTemplates = {
      artists: [
        `${name}: The Sound of Tomorrow`,
        `Spotlight: ${name}'s Cultural Impact`,
        `${name}: Redefining Modern Music`,
        `The ${name} Phenomenon Explained`,
      ],
      trends: [
        `Understanding the ${name} Movement`,
        `${name}: The Trend Shaping Our Digital Future`,
        `Inside the ${name} Cultural Shift`,
        `Why ${name} Matters Right Now`,
      ],
      movies: [
        `${name}: Cinema's Latest Masterpiece`,
        `The Cultural Impact of ${name}`,
        `${name}: Why Everyone's Talking About This Film`,
        `Inside ${name}: A Cinematic Revolution`,
      ],
      books: [
        `${name}: The Literary Sensation Explained`,
        `Why ${name} is Captivating Readers Worldwide`,
        `${name}: More Than Just a Bestseller`,
        `The Cultural Phenomenon of ${name}`,
      ],
      tv_shows: [
        `${name}: The Series Everyone's Watching`,
        `Inside ${name}: Television's Latest Hit`,
        `${name}: Why This Show is Breaking Records`,
        `The Cultural Impact of ${name}`,
      ],
    }

    const templates = titleTemplates[category as keyof typeof titleTemplates] || titleTemplates.trends
    return templates[Math.floor(Math.random() * templates.length)]
  }

  private createFallbackArticle(entity: QlooEntity, category: string): NewsletterArticle {
    return this.createPremiumFallbackArticle(category, entity)
  }

  private cleanContent(content: string): string {
    return content
      .replace(/[#"*]/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\n\s*\n/g, "\n\n")
      .replace(/\n/g, "\n\n")
      .trim()
  }

  private formatCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      artists: "Music & Artists",
      trends: "Global Trends",
      movies: "Cinema & Film",
      books: "Literature & Books",
      tv_shows: "Television & Streaming",
    }
    return categoryMap[category] || category
  }

  // Legacy method for backward compatibility
  async generateNewsletterContent(categories: string[]): Promise<NewsletterArticle[]> {
    return this.generatePersonalizedNewsletter(categories)
  }
}

export const newsletterGenerator = new NewsletterGenerator()
