// Test the optimized newsletter system
const API_BASE = 'http://localhost:3000'

async function testOptimizedNewsletter() {
    console.log('🚀 Testing Optimized Newsletter System...\n')

    // Test payload
    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        categories: ['movies', 'trends']
    }

    try {
        console.log('📝 Testing newsletter subscription...')

        const response = await fetch(`${API_BASE}/api/send-test-newsletter-optimized`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testUser)
        })

        const result = await response.json()

        if (response.ok) {
            console.log('✅ Newsletter subscription successful!')
            console.log('📧 Response:', result)

            if (result.newsletter) {
                console.log(`\n📰 Newsletter Details:`)
                console.log(`- ID: ${result.newsletter.id}`)
                console.log(`- Title: ${result.newsletter.title}`)
                console.log(`- Articles: ${result.newsletter.articlesCount}`)
                console.log(`- Already Sent: ${result.newsletter.alreadySent || false}`)
            }

            // Test sending again to see caching in action
            console.log('\n🔄 Testing cache - subscribing same user again...')
            const response2 = await fetch(`${API_BASE}/api/send-test-newsletter-optimized`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testUser)
            })

            const result2 = await response2.json()
            console.log('📧 Second response:', result2)

            if (result2.newsletter?.alreadySent) {
                console.log('✅ Caching working! Newsletter not regenerated.')
            }

        } else {
            console.log('❌ Newsletter subscription failed:', result)
        }

    } catch (error) {
        console.error('❌ Error testing newsletter:', error)
    }
}

// Run the test
testOptimizedNewsletter()
