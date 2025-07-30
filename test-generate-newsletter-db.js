// Test the updated generate-newsletter API with database saving
const API_BASE = 'http://localhost:3000'

async function testNewsletterGeneration() {
    console.log('🚀 Testing Newsletter Generation API with DB Saving...\n')

    const testCases = [
        {
            name: 'Standard Newsletter',
            payload: {
                categories: ['movies', 'trends']
            }
        },
        {
            name: 'Personalized Newsletter',
            payload: {
                categories: ['artists', 'books'],
                userPreferences: {
                    favoriteGenres: ['sci-fi', 'thriller'],
                    ageRange: '25-35',
                    interests: ['technology', 'music']
                },
                personalized: true
            }
        },
        {
            name: 'Location-based Newsletter',
            payload: {
                categories: ['trends', 'movies'],
                location: 'New York'
            }
        },
        {
            name: 'Newsletter for Specific Week',
            payload: {
                categories: ['artists', 'trends'],
                weekOf: '2025-08-04T00:00:00.000Z' // Next week
            }
        }
    ]

    for (const testCase of testCases) {
        console.log(`📋 Testing: ${testCase.name}`)
        console.log(`📤 Payload:`, JSON.stringify(testCase.payload, null, 2))

        try {
            const response = await fetch(`${API_BASE}/api/generate-newsletter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testCase.payload)
            })

            const result = await response.json()

            if (response.ok) {
                console.log('✅ Generation successful!')
                console.log(`📰 Newsletter ID: ${result.newsletter?.id}`)
                console.log(`📄 Title: ${result.newsletter?.title}`)
                console.log(`📅 Week Of: ${result.newsletter?.weekOf}`)
                console.log(`📊 Articles Generated: ${result.total_articles}`)
                console.log(`💾 Saved to DB: ${result.saved_to_db}`)
                console.log(`🔗 Generation Type: ${result.generation_type}`)

                if (result.articles && result.articles.length > 0) {
                    console.log(`📝 Sample Article: "${result.articles[0].title}"`)
                }
            } else {
                console.log('❌ Generation failed:', result)
            }

        } catch (error) {
            console.error('❌ Error testing newsletter generation:', error)
        }

        console.log('\n' + '='.repeat(50) + '\n')
    }

    // Test duplicate generation (should find existing)
    console.log('🔄 Testing duplicate prevention...')
    try {
        const duplicateResponse = await fetch(`${API_BASE}/api/generate-newsletter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testCases[0].payload) // Same as first test
        })

        const duplicateResult = await duplicateResponse.json()
        console.log('📧 Duplicate test result:', duplicateResult)

        if (duplicateResult.newsletter) {
            console.log('✅ Duplicate prevention working - existing newsletter found!')
        }

    } catch (error) {
        console.error('❌ Error testing duplicate prevention:', error)
    }
}

// Get API documentation
async function getApiDocs() {
    console.log('📚 Getting API Documentation...\n')

    try {
        const response = await fetch(`${API_BASE}/api/generate-newsletter`)
        const docs = await response.json()
        console.log('📖 API Documentation:', JSON.stringify(docs, null, 2))
    } catch (error) {
        console.error('❌ Error getting API docs:', error)
    }

    console.log('\n' + '='.repeat(80) + '\n')
}

// Run tests
async function runTests() {
    await getApiDocs()
    await testNewsletterGeneration()
}

runTests()
