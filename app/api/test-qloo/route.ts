import { NextResponse } from "next/server"
import { qlooService } from "@/lib/qloo-service"

export async function GET() {
  try {
    console.log("🧪 Testing Qloo API integration...")

    // Test search functionality
    const taylorSwift = await qlooService.searchEntity("Taylor Swift")
    const valorant = await qlooService.searchEntity("Valorant")

    // Test trending data
    const trendingArtists = await qlooService.getTrendingArtists()
    const trendingGames = await qlooService.getTrendingGames()

    return NextResponse.json({
      success: true,
      test_results: {
        taylor_swift_search: taylorSwift ? "✅ Found" : "❌ Not found",
        valorant_search: valorant ? "✅ Found" : "❌ Not found",
        trending_artists_count: trendingArtists.length,
        trending_games_count: trendingGames.length,
      },
      sample_data: {
        artist: taylorSwift,
        game: valorant,
        trending_artists: trendingArtists.slice(0, 2),
        trending_games: trendingGames.slice(0, 2),
      },
    })
  } catch (error) {
    console.error("❌ Qloo API test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
