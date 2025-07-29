import { NextResponse } from "next/server"
import { qlooService } from "@/lib/qloo-service"

export async function GET() {
  const debugResults: any = {
    timestamp: new Date().toISOString(),
    tests: {},
  }

  try {
    console.log("🧪 Starting Qloo API debug tests...")

    // Test 1: Basic search
    console.log("Test 1: Basic search for Taylor Swift")
    try {
      const taylorSwift = await qlooService.searchEntity("Taylor Swift")
      debugResults.tests.search_taylor_swift = {
        success: !!taylorSwift,
        result: taylorSwift ? { name: taylorSwift.name, id: taylorSwift.entity_id } : null,
      }
    } catch (error) {
      debugResults.tests.search_taylor_swift = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    // Test 2: Trending by category
    console.log("Test 2: Get trending artists")
    try {
      const trendingArtists = await qlooService.getTrendingByCategory("artists")
      debugResults.tests.trending_artists = {
        success: true,
        count: trendingArtists.length,
        sample: trendingArtists.slice(0, 2).map((a) => ({ name: a.name, id: a.entity_id })),
      }
    } catch (error) {
      debugResults.tests.trending_artists = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    // Test 3: Movie insights
    console.log("Test 3: Get movie insights")
    try {
      const movieInsights = await qlooService.getMovieInsights({ limit: 5 })
      debugResults.tests.movie_insights = {
        success: true,
        count: movieInsights.length,
        sample: movieInsights.slice(0, 2).map((m) => ({ name: m.name, id: m.entity_id })),
      }
    } catch (error) {
      debugResults.tests.movie_insights = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    // Test 4: Direct API call
    console.log("Test 4: Direct API call to search")
    try {
      const response = await fetch("https://hackathon.api.qloo.com/search?query=Valorant", {
        headers: {
          "X-Api-Key": "AWRLhWroYioXSp1qmDhw50ITB9RCVt8MEBVFcxHpoZ0",
        },
      })

      debugResults.tests.direct_api_call = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
      }

      if (response.ok) {
        const data = await response.json()
        debugResults.tests.direct_api_call.hasResults = !!(data.results && data.results.length > 0)
        debugResults.tests.direct_api_call.resultCount = data.results?.length || 0
      }
    } catch (error) {
      debugResults.tests.direct_api_call = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    return NextResponse.json(debugResults)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        debugResults,
      },
      { status: 500 },
    )
  }
}
