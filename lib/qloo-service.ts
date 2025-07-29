const QLOO_API_KEY = "AWRLhWroYioXSp1qmDhw50ITB9RCVt8MEBVFcxHpoZ0"
const QLOO_BASE_URL = "https://hackathon.api.qloo.com"

export interface QlooEntity {
  entity_id: string
  name: string
  type: string
  description?: string
  image_url?: string
  metadata?: any
  affinity_score?: number
}

export interface QlooTrendData {
  date: string
  population_rank: number
  population_rank_velocity: number
}

export interface QlooSearchResult {
  results: QlooEntity[]
}

export interface QlooTrendsResult {
  results: {
    trends: QlooTrendData[]
  }
}

export interface QlooInsightResult {
  results: QlooEntity[]
  metadata?: any
}

export interface QlooTag {
  tag_id: string
  name: string
  type: string
  affinity_score?: number
}

export interface QlooDemographic {
  demographic_id: string
  name: string
  affinity_score: number
  type: string
}

export class QlooService {
  private options = {
    method: "GET",
    headers: {
      "X-Api-Key": QLOO_API_KEY,
    },
  }

  private async makeRequest(url: string): Promise<any> {
    const response = await fetch(url, this.options)

    if (!response.ok) {
      throw new Error(`Qloo API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async searchEntity(query: string): Promise<QlooEntity | null> {
    try {
      const searchUrl = `${QLOO_BASE_URL}/search?query=${encodeURIComponent(query)}`
      const searchResult: QlooSearchResult = await this.makeRequest(searchUrl)

      if (!searchResult.results || searchResult.results.length === 0) {
        return null
      }

      return searchResult.results[0]
    } catch (error) {
      console.error("Error searching entity:", error)
      return null
    }
  }

  async getEntityTrends(entityId: string): Promise<QlooTrendData[]> {
    try {
      const trendsUrl = `${QLOO_BASE_URL}/trends/entity?entity_id=${entityId}`
      const trendData: QlooTrendsResult = await this.makeRequest(trendsUrl)

      if (!trendData.results || !trendData.results.trends) {
        return []
      }

      return trendData.results.trends
    } catch (error) {
      console.error("Error getting entity trends:", error)
      return []
    }
  }

  // Expanded trending artists with more diversity
  async getTrendingArtists(): Promise<QlooEntity[]> {
    const artistQueries = [
      // Pop & Mainstream
      "Taylor Swift",
      "Drake",
      "Bad Bunny",
      "The Weeknd",
      "Billie Eilish",
      "Ariana Grande",
      "Post Malone",
      "Dua Lipa",
      "Harry Styles",
      "Olivia Rodrigo",

      // Hip-Hop & Rap
      "Kendrick Lamar",
      "Travis Scott",
      "Lil Baby",
      "Future",
      "21 Savage",

      // International & Rising
      "BTS",
      "BLACKPINK",
      "Rosalía",
      "Burna Boy",
      "Tems",

      // Alternative & Indie
      "Phoebe Bridgers",
      "Clairo",
      "Mac Miller",
      "Tyler, The Creator",
      "Frank Ocean",
    ]

    const artists: QlooEntity[] = []

    // Get a diverse mix of artists
    for (const query of this.shuffleArray(artistQueries).slice(0, 8)) {
      const entity = await this.searchEntity(query)
      if (entity) {
        artists.push(entity)
      }
    }

    return artists
  }

  // Expanded trending movies with current releases
  async getTrendingMovies(): Promise<QlooEntity[]> {
    const movieQueries = [
      // Recent Blockbusters
      "Dune",
      "Spider-Man",
      "Avatar",
      "Top Gun Maverick",
      "Black Panther",
      "The Batman",
      "Doctor Strange",
      "Thor",
      "Jurassic World",
      "Fast X",

      // Award Winners & Critical Darlings
      "Everything Everywhere All at Once",
      "The Banshees of Inisherin",
      "Tar",
      "The Fabelmans",
      "Triangle of Sadness",

      // Horror & Thriller
      "Scream",
      "The Black Phone",
      "Nope",
      "Barbarian",
      "Smile",

      // International Cinema
      "Parasite",
      "Minari",
      "Drive My Car",
      "The Handmaiden",
      "Burning",
    ]

    const movies: QlooEntity[] = []

    for (const query of this.shuffleArray(movieQueries).slice(0, 8)) {
      const entity = await this.searchEntity(query)
      if (entity) {
        movies.push(entity)
      }
    }

    return movies
  }

  // MASSIVELY EXPANDED TRENDS - This is the key improvement!
  async getTrendingContent(): Promise<QlooEntity[]> {
    const trendQueries = [
      // Social Media Trends
      "TikTok",
      "Instagram Reels",
      "YouTube Shorts",
      "Twitter Spaces",
      "Clubhouse",
      "BeReal",
      "Discord",
      "Twitch",
      "OnlyFans",
      "Patreon",

      // Technology Trends
      "ChatGPT",
      "AI",
      "Artificial Intelligence",
      "NFT",
      "Cryptocurrency",
      "Bitcoin",
      "Ethereum",
      "Metaverse",
      "Virtual Reality",
      "Augmented Reality",
      "Web3",
      "Blockchain",
      "Tesla",
      "Apple",
      "Google",

      // Gaming Beyond Just Valorant
      "Fortnite",
      "Minecraft",
      "Roblox",
      "Among Us",
      "Fall Guys",
      "Call of Duty",
      "FIFA",
      "NBA 2K",
      "Grand Theft Auto",
      "Pokemon",
      "League of Legends",
      "Apex Legends",
      "Overwatch",
      "Rocket League",

      // Streaming & Content
      "Netflix",
      "Disney Plus",
      "HBO Max",
      "Amazon Prime",
      "Hulu",
      "Spotify",
      "Apple Music",
      "YouTube Music",
      "Podcast",
      "Audiobooks",

      // Fashion & Lifestyle
      "Balenciaga",
      "Gucci",
      "Louis Vuitton",
      "Nike",
      "Adidas",
      "Supreme",
      "Off-White",
      "Yeezy",
      "Fashion Week",
      "Streetwear",

      // Food & Dining Trends
      "Plant-based",
      "Vegan",
      "Keto",
      "Intermittent Fasting",
      "Bubble Tea",
      "Korean BBQ",
      "Ramen",
      "Sushi",
      "Tacos",
      "Pizza",

      // Fitness & Wellness
      "Yoga",
      "Pilates",
      "CrossFit",
      "Peloton",
      "Meditation",
      "Mental Health",
      "Therapy",
      "Wellness",
      "Self-care",
      "Mindfulness",

      // Cultural Movements
      "Sustainability",
      "Climate Change",
      "Social Justice",
      "Diversity",
      "Remote Work",
      "Work from Home",
      "Digital Nomad",
      "Side Hustle",

      // Entertainment Formats
      "Reality TV",
      "True Crime",
      "Documentary",
      "Stand-up Comedy",
      "Podcast",
      "Live Streaming",
      "Virtual Concerts",
      "Online Events",

      // Viral Phenomena
      "Memes",
      "Viral Videos",
      "Internet Culture",
      "Online Communities",
      "Influencer Marketing",
      "Creator Economy",
      "UGC",
    ]

    const trends: QlooEntity[] = []

    // Get a diverse mix of trending content
    for (const query of this.shuffleArray(trendQueries).slice(0, 15)) {
      const entity = await this.searchEntity(query)
      if (entity) {
        trends.push(entity)
      }
    }

    return trends
  }

  // Get books with more variety
  async getTrendingBooks(): Promise<QlooEntity[]> {
    const bookQueries = [
      // Fiction Bestsellers
      "Where the Crawdads Sing",
      "The Seven Husbands of Evelyn Hugo",
      "It Ends with Us",
      "The Silent Patient",
      "Gone Girl",

      // Non-Fiction
      "Atomic Habits",
      "The Subtle Art of Not Giving a F*ck",
      "Educated",
      "Becoming",
      "Sapiens",

      // Fantasy & Sci-Fi
      "Harry Potter",
      "Game of Thrones",
      "The Hunger Games",
      "Dune",
      "The Handmaid's Tale",

      // Young Adult
      "The Fault in Our Stars",
      "Thirteen Reasons Why",
      "The Hate U Give",
      "Eleanor Oliphant Is Completely Fine",

      // Classic Literature
      "Pride and Prejudice",
      "1984",
      "To Kill a Mockingbird",
      "The Great Gatsby",
      "Lord of the Rings",
    ]

    const books: QlooEntity[] = []

    for (const query of this.shuffleArray(bookQueries).slice(0, 8)) {
      const entity = await this.searchEntity(query)
      if (entity) {
        books.push(entity)
      }
    }

    return books
  }

  // TV Shows trending content
  async getTrendingTVShows(): Promise<QlooEntity[]> {
    const tvQueries = [
      // Current Hits
      "Stranger Things",
      "The Bear",
      "House of the Dragon",
      "Rings of Power",
      "Wednesday",
      "Euphoria",
      "The White Lotus",
      "Succession",

      // Reality & Competition
      "Love Island",
      "The Bachelor",
      "Survivor",
      "Big Brother",
      "RuPaul's Drag Race",
      "The Voice",
      "American Idol",

      // International Content
      "Squid Game",
      "Money Heist",
      "Dark",
      "Lupin",
      "Elite",

      // Comedy
      "The Office",
      "Friends",
      "Brooklyn Nine-Nine",
      "Schitt's Creek",
      "Ted Lasso",
      "The Good Place",
      "Parks and Recreation",
    ]

    const shows: QlooEntity[] = []

    for (const query of this.shuffleArray(tvQueries).slice(0, 8)) {
      const entity = await this.searchEntity(query)
      if (entity) {
        shows.push(entity)
      }
    }

    return shows
  }

  // Utility function to shuffle arrays for variety
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Updated method with much broader trend coverage
  async getTrendingByCategory(
    category: string,
    userPreferences?: {
      location?: string
      tags?: string[]
      demographics?: string[]
    },
  ): Promise<QlooEntity[]> {
    try {
      console.log(`🔍 Getting trending ${category} content...`)

      let entities: QlooEntity[] = []

      switch (category) {
        case "artists":
          entities = await this.getTrendingArtists()
          break
        case "movies":
          entities = await this.getTrendingMovies()
          break
        case "trends":
          // This is the BIG change - much broader trends!
          entities = await this.getTrendingContent()
          break
        case "books":
          entities = await this.getTrendingBooks()
          break
        case "tv_shows":
          entities = await this.getTrendingTVShows()
          break
        default:
          entities = await this.getTrendingContent()
      }

      // Try to enhance with Insights API if we have entities
      if (entities.length > 0) {
        try {
          let filterType: string
          switch (category) {
            case "artists":
              filterType = "urn:entity:artist"
              break
            case "movies":
              filterType = "urn:entity:movie"
              break
            case "tv_shows":
              filterType = "urn:entity:tv_show"
              break
            case "books":
              filterType = "urn:entity:book"
              break
            default:
              filterType = "urn:entity:movie"
          }

          const params = new URLSearchParams({
            "filter.type": filterType,
            limit: "10",
          })

          if (userPreferences?.location) {
            params.append("signal.location.query", userPreferences.location)
          }

          const url = `${QLOO_BASE_URL}/v2/insights?${params.toString()}`
          const result: QlooInsightResult = await this.makeRequest(url)

          if (result.results && result.results.length > 0) {
            // Merge insights results with our search results
            const insightEntities = result.results.slice(0, 5)
            entities = [...insightEntities, ...entities.slice(0, 5)]
          }
        } catch (insightsError) {
          console.log(`⚠️ Insights API enhancement failed, using search results`)
        }
      }

      console.log(`✅ Got ${entities.length} entities for ${category}`)
      return entities.slice(0, 10) // Limit to top 10
    } catch (error) {
      console.error(`❌ Error getting trending ${category}:`, error)
      return []
    }
  }

  // All other methods remain the same...
  async getMovieInsights(
    options: {
      tags?: string[]
      releaseYearMin?: number
      releaseYearMax?: number
      limit?: number
    } = {},
  ): Promise<QlooEntity[]> {
    try {
      const params = new URLSearchParams({
        "filter.type": "urn:entity:movie",
        limit: (options.limit || 10).toString(),
      })

      if (options.tags && options.tags.length > 0) {
        params.append("filter.tags", options.tags.join(","))
      }

      if (options.releaseYearMin) {
        params.append("filter.release_year.min", options.releaseYearMin.toString())
      }

      if (options.releaseYearMax) {
        params.append("filter.release_year.max", options.releaseYearMax.toString())
      }

      const url = `${QLOO_BASE_URL}/v2/insights?${params.toString()}`
      const result: QlooInsightResult = await this.makeRequest(url)

      return result.results || []
    } catch (error) {
      console.error("Error getting movie insights:", error)
      return []
    }
  }

  async getArtistInsights(options: { tags?: string[]; limit?: number } = {}): Promise<QlooEntity[]> {
    try {
      const params = new URLSearchParams({
        "filter.type": "urn:entity:artist",
        limit: (options.limit || 10).toString(),
      })

      if (options.tags && options.tags.length > 0) {
        params.append("filter.tags", options.tags.join(","))
      }

      const url = `${QLOO_BASE_URL}/v2/insights?${params.toString()}`
      const result: QlooInsightResult = await this.makeRequest(url)

      return result.results || []
    } catch (error) {
      console.error("Error getting artist insights:", error)
      return []
    }
  }

  async getDemographicInsights(entityId: string): Promise<QlooDemographic[]> {
    try {
      const params = new URLSearchParams({
        "filter.type": "urn:demographics",
        "signal.interests.entities": entityId,
      })

      const url = `${QLOO_BASE_URL}/v2/insights?${params.toString()}`
      const result = await this.makeRequest(url)

      return result.results || []
    } catch (error) {
      console.error("Error getting demographic insights:", error)
      return []
    }
  }

  async getLocationBasedInsights(
    filterType: string,
    location: string,
    options: { limit?: number } = {},
  ): Promise<QlooEntity[]> {
    try {
      const params = new URLSearchParams({
        "filter.type": filterType,
        "signal.location.query": location,
        limit: (options.limit || 10).toString(),
      })

      const url = `${QLOO_BASE_URL}/v2/insights?${params.toString()}`
      const result: QlooInsightResult = await this.makeRequest(url)

      return result.results || []
    } catch (error) {
      console.error("Error getting location-based insights:", error)
      return []
    }
  }

  async getTagInsights(
    options: {
      tagTypes?: string[]
      parentTypes?: string[]
      audienceIds?: string[]
      entityIds?: string[]
      limit?: number
    } = {},
  ): Promise<QlooTag[]> {
    try {
      const params = new URLSearchParams({
        "filter.type": "urn:tag",
        limit: (options.limit || 20).toString(),
      })

      if (options.tagTypes && options.tagTypes.length > 0) {
        params.append("filter.tag.types", options.tagTypes.join(","))
      }

      if (options.parentTypes && options.parentTypes.length > 0) {
        params.append("filter.parents.types", options.parentTypes.join(","))
      }

      if (options.audienceIds && options.audienceIds.length > 0) {
        params.append("signal.demographics.audiences", options.audienceIds.join(","))
      }

      if (options.entityIds && options.entityIds.length > 0) {
        params.append("signal.interests.entities", options.entityIds.join(","))
      }

      const url = `${QLOO_BASE_URL}/v2/insights?${params.toString()}`
      const result = await this.makeRequest(url)

      return result.results || []
    } catch (error) {
      console.error("Error getting tag insights:", error)
      return []
    }
  }

  async getPersonalizedRecommendations(options: {
    filterType: string
    interests?: string[]
    location?: string
    demographics?: string[]
    tags?: string[]
    limit?: number
  }): Promise<QlooEntity[]> {
    try {
      const params = new URLSearchParams({
        "filter.type": options.filterType,
        limit: (options.limit || 10).toString(),
      })

      if (options.interests && options.interests.length > 0) {
        params.append("signal.interests.entities", options.interests.join(","))
      }

      if (options.location) {
        params.append("signal.location.query", options.location)
      }

      if (options.demographics && options.demographics.length > 0) {
        params.append("signal.demographics.audiences", options.demographics.join(","))
      }

      if (options.tags && options.tags.length > 0) {
        params.append("signal.interests.tags", options.tags.join(","))
      }

      const url = `${QLOO_BASE_URL}/v2/insights?${params.toString()}`
      const result: QlooInsightResult = await this.makeRequest(url)

      return result.results || []
    } catch (error) {
      console.error("Error getting personalized recommendations:", error)
      return []
    }
  }
}

export const qlooService = new QlooService()
