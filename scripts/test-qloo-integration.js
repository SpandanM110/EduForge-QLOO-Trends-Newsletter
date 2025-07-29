const QLOO_API_KEY = "AWRLhWroYioXSp1qmDhw50ITB9RCVt8MEBVFcxHpoZ0"
const BASE_URL = "https://hackathon.api.qloo.com"

const options = {
  method: "GET",
  headers: { "X-Api-Key": QLOO_API_KEY },
}

async function testQlooIntegration() {
  console.log("🚀 Testing Qloo API Integration...")

  try {
    // Test 1: Search for a popular artist
    console.log("\n📍 Test 1: Searching for 'Taylor Swift'...")
    const searchUrl = `${BASE_URL}/search?query=${encodeURIComponent("Taylor Swift")}`
    const searchResponse = await fetch(searchUrl, options)

    if (!searchResponse.ok) {
      throw new Error(`Search failed: ${searchResponse.status}`)
    }

    const searchResult = await searchResponse.json()
    console.log("✅ Search successful!")
    console.log(`Found: ${searchResult.results?.[0]?.name || "No results"}`)
    console.log(`Entity ID: ${searchResult.results?.[0]?.entity_id || "N/A"}`)

    // Test 2: Get trends for the entity
    if (searchResult.results?.[0]?.entity_id) {
      console.log("\n📍 Test 2: Getting trend data...")
      const entityId = searchResult.results[0].entity_id
      const trendsUrl = `${BASE_URL}/trends/entity?entity_id=${entityId}`
      const trendsResponse = await fetch(trendsUrl, options)

      if (!trendsResponse.ok) {
        console.log(`⚠️ Trends query failed: ${trendsResponse.status}`)
      } else {
        const trendData = await trendsResponse.json()
        console.log("✅ Trends data retrieved!")

        if (trendData.results?.trends?.length > 0) {
          const latest = trendData.results.trends[0]
          console.log(`Latest rank: #${latest.population_rank}`)
          console.log(`Velocity: ${latest.population_rank_velocity}`)
          console.log(`Date: ${latest.date}`)
        } else {
          console.log("📊 No trend data available for this entity")
        }
      }
    }

    // Test 3: Search for a game
    console.log("\n📍 Test 3: Searching for 'Valorant'...")
    const gameSearchUrl = `${BASE_URL}/search?query=${encodeURIComponent("Valorant")}`
    const gameSearchResponse = await fetch(gameSearchUrl, options)

    if (gameSearchResponse.ok) {
      const gameResult = await gameSearchResponse.json()
      console.log("✅ Game search successful!")
      console.log(`Found: ${gameResult.results?.[0]?.name || "No results"}`)
    }

    console.log("\n🎉 All tests completed successfully!")
  } catch (error) {
    console.error("\n❌ Test failed:", error.message)
  }
}

// Run the test
testQlooIntegration()
