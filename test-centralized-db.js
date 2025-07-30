// Test the updated newsletter generation with centralized database saving
const API_BASE = 'http://localhost:3000'

async function testCentralizedDBSaving() {
    console.log('🚀 Testing Centralized Database Saving in Newsletter Generator...\n')

    const testPayload = {
        categories: ['movies', 'trends'],
        weekOf: '2025-08-04T00:00:00.000Z' // Next week
    }

    console.log('📋 Test Payload:', JSON.stringify(testPayload, null, 2))

    try {
        // Test 1: Generate newsletter (should save to DB)
        console.log('\n🔸 Test 1: First generation (should save to DB)')
        const response1 = await fetch(`${API_BASE}/api/generate-newsletter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testPayload)
        })

        const result1 = await response1.json()

        if (response1.ok) {
            console.log('✅ First generation successful!')
            console.log(`📰 Newsletter ID: ${result1.newsletter?.id}`)
            console.log(`📄 Title: ${result1.newsletter?.title}`)
            console.log(`📊 Articles: ${result1.total_articles}`)
            console.log(`💾 Saved to DB: ${result1.saved_to_db}`)
            console.log(`🆕 Is New: ${!result1.newsletter?.isExisting}`)
        } else {
            console.log('❌ First generation failed:', result1)
            return
        }

        // Test 2: Generate same newsletter again (should find existing)
        console.log('\n🔸 Test 2: Second generation (should find existing)')
        const response2 = await fetch(`${API_BASE}/api/generate-newsletter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testPayload)
        })

        const result2 = await response2.json()

        if (response2.ok) {
            console.log('✅ Second generation successful!')
            console.log(`📰 Newsletter ID: ${result2.newsletter?.id}`)
            console.log(`📄 Title: ${result2.newsletter?.title}`)
            console.log(`📊 Articles: ${result2.total_articles}`)
            console.log(`💾 Saved to DB: ${result2.saved_to_db}`)
            console.log(`🔄 Is Existing: ${result2.newsletter?.isExisting}`)

            // Verify IDs match
            if (result1.newsletter?.id === result2.newsletter?.id) {
                console.log('✅ Perfect! Same newsletter ID returned - no duplication!')
            } else {
                console.log('⚠️  Different newsletter IDs - potential duplication issue')
            }
        } else {
            console.log('❌ Second generation failed:', result2)
        }

        // Test 3: Different categories (should create new)
        console.log('\n🔸 Test 3: Different categories (should create new)')
        const differentPayload = {
            categories: ['artists', 'books'],
            weekOf: '2025-08-04T00:00:00.000Z'
        }

        const response3 = await fetch(`${API_BASE}/api/generate-newsletter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(differentPayload)
        })

        const result3 = await response3.json()

        if (response3.ok) {
            console.log('✅ Different categories generation successful!')
            console.log(`📰 Newsletter ID: ${result3.newsletter?.id}`)
            console.log(`📄 Title: ${result3.newsletter?.title}`)
            console.log(`📊 Articles: ${result3.total_articles}`)
            console.log(`🆕 Is New: ${!result3.newsletter?.isExisting}`)

            // Verify different ID
            if (result1.newsletter?.id !== result3.newsletter?.id) {
                console.log('✅ Perfect! Different newsletter ID for different categories!')
            } else {
                console.log('⚠️  Same newsletter ID for different categories - issue detected')
            }
        } else {
            console.log('❌ Different categories generation failed:', result3)
        }

        // Test 4: Test personalized newsletter
        console.log('\n🔸 Test 4: Personalized newsletter')
        const personalizedPayload = {
            categories: ['artists', 'movies'],
            personalized: true,
            userPreferences: {
                favoriteGenres: ['action', 'comedy'],
                ageRange: '25-35'
            },
            weekOf: '2025-08-04T00:00:00.000Z'
        }

        const response4 = await fetch(`${API_BASE}/api/generate-newsletter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(personalizedPayload)
        })

        const result4 = await response4.json()

        if (response4.ok) {
            console.log('✅ Personalized generation successful!')
            console.log(`📰 Newsletter ID: ${result4.newsletter?.id}`)
            console.log(`📄 Title: ${result4.newsletter?.title}`)
            console.log(`🎯 Type: ${result4.generation_type}`)
            console.log(`📊 Articles: ${result4.total_articles}`)
        } else {
            console.log('❌ Personalized generation failed:', result4)
        }

    } catch (error) {
        console.error('❌ Error testing centralized DB saving:', error)
    }
}

// Run the test
testCentralizedDBSaving()
