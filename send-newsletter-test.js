const { emailService } = require('./lib/email-service.js');
require('dotenv').config();

// Since we're using JavaScript, we'll need to import the TypeScript modules differently
// We'll use dynamic imports for the TypeScript modules

async function sendCompleteNewsletter() {
    try {
        console.log('🚀 Starting complete newsletter send test...');

        // Test user data
        const testUser = {
            name: 'Test User',
            email: 'parashartanish22@gmail.com',
            categories: ['artists', 'trends', 'movies']
        };

        console.log(`📧 Generating newsletter for categories: ${testUser.categories.join(', ')}`);

        // Since we're in a JS file and the newsletter service is TypeScript,
        // let's use a direct approach by calling the API endpoint instead
        const response = await fetch('http://localhost:3000/api/generate-newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'personalized',
                categories: testUser.categories,
                weekOf: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        const newsletterData = await response.json();

        console.log('✅ Newsletter generated successfully!');
        console.log(`📝 Articles: ${newsletterData.articles?.length || 0}`);

        // Use the HTML content from the database/API or generate it
        let htmlContent = newsletterData.newsletter?.htmlContent;

        if (!htmlContent && newsletterData.articles) {
            console.log('🎨 HTML content not found, using fallback template...');
            htmlContent = generateFallbackHTML(newsletterData.articles, testUser.name);
        }

        if (!htmlContent) {
            throw new Error('No HTML content available for email');
        }

        console.log('📤 Sending newsletter email...');

        // Send the newsletter
        const result = await emailService.sendEmail({
            to: testUser.email,
            subject: `${newsletterData.newsletter?.title || 'Your Weekly Qloo Trends'} - Week of ${new Date().toLocaleDateString()}`,
            html: htmlContent
        });

        if (result) {
            console.log('✅ Newsletter sent successfully!');
            console.log('📧 Email ID:', result.id);
            console.log('📬 Sent to:', testUser.email);
            console.log('📊 Newsletter ID:', newsletterData.newsletter?.id);
        } else {
            console.error('❌ Failed to send newsletter.');
        }

        return result;

    } catch (error) {
        console.error('❌ Error sending complete newsletter:', error);

        if (error.message?.includes('fetch')) {
            console.log('💡 Make sure your Next.js server is running on localhost:3000');
            console.log('💡 You can start it with: npm run dev');
        }

        throw error;
    }
}

// Fallback HTML template function (simplified version)
function generateFallbackHTML(articles, userName) {
    const greeting = userName ? `Hi ${userName}` : "Hello";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Qloo Trends Newsletter</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 680px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #f7fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            border-radius: 12px 12px 0 0;
            margin: -30px -30px 30px -30px;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
        }
        .greeting {
            padding: 20px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .article {
            padding: 30px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .article:last-child { border-bottom: none; }
        .article-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #1a202c;
        }
        .article-meta {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        .category-badge {
            background: #3182ce;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .trending-badge {
            background: #e53e3e;
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: 600;
        }
        .read-time {
            background: #edf2f7;
            color: #4a5568;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
        }
        .article-excerpt {
            font-size: 16px;
            color: #4a5568;
            font-style: italic;
            margin-bottom: 15px;
        }
        .article-content {
            color: #2d3748;
            line-height: 1.7;
            margin-bottom: 15px;
        }
        .footer {
            text-align: center;
            padding: 30px 0;
            border-top: 1px solid #e2e8f0;
            color: #718096;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 Qloo Trends</h1>
            <p>Premium insights into culture, entertainment & trends</p>
        </div>
        
        <div class="greeting">
            <h2>${greeting}!</h2>
            <p>Here's your personalized newsletter with the latest trends and insights.</p>
        </div>
        
        ${articles.map(article => `
            <div class="article">
                <div class="article-meta">
                    <span class="category-badge">${article.category || 'General'}</span>
                    ${article.trending ? '<span class="trending-badge">TRENDING</span>' : ''}
                    <span class="read-time">${article.read_time || '3 min read'}</span>
                </div>
                
                <h2 class="article-title">${article.title}</h2>
                
                ${article.excerpt ? `<p class="article-excerpt">${article.excerpt}</p>` : ''}
                
                <div class="article-content">
                    ${article.content ? article.content.split('\n\n').map(p => `<p>${p}</p>`).join('') : ''}
                </div>
            </div>
        `).join('')}
        
        <div class="footer">
            <h3>Powered by Qloo AI</h3>
            <p>This newsletter combines real-time trend data with AI-powered content generation.</p>
            <p><a href="#unsubscribe" style="color: #3182ce;">Unsubscribe</a> | <a href="#preferences" style="color: #3182ce;">Update Preferences</a></p>
        </div>
    </div>
</body>
</html>
  `;
}

// Alternative approach: Send using existing database newsletter
async function sendExistingNewsletter() {
    try {
        console.log('🔍 Fetching existing newsletter from database...');

        // Call the API to get an existing newsletter using POST with body
        const response = await fetch('http://localhost:3000/api/preview-newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                categories: ['artists', 'trends', 'movies']
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.newsletter && data.newsletter.htmlContent) {
            console.log('✅ Found newsletter with HTML content');

            const result = await emailService.sendEmail({
                to: 'spandanmukherjee2003@gmail.com',
                subject: `${data.newsletter.title} - Week of ${new Date().toLocaleDateString()}`,
                html: data.newsletter.htmlContent
            });

            if (result) {
                console.log('✅ Existing newsletter sent successfully!');
                console.log('📧 Email ID:', result.id);
            }

            return result;
        } else {
            console.log('❌ No HTML content found in existing newsletter');
            return null;
        }

    } catch (error) {
        console.error('❌ Error sending existing newsletter:', error);
        throw error;
    }
}

// Run the test
if (require.main === module) {
    console.log('📧 Choose sending method:');
    console.log('1. Generate new newsletter and send');
    console.log('2. Send existing newsletter from database');

    // For now, let's try the existing newsletter first, then fallback to new generation
    sendExistingNewsletter()
        .then((result) => {
            if (result) {
                console.log('🎉 Test completed successfully using existing newsletter!');
                process.exit(0);
            } else {
                console.log('🔄 Fallback: Trying to generate new newsletter...');
                return sendCompleteNewsletter();
            }
        })
        .then(() => {
            console.log('🎉 Test completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Test failed:', error);
            process.exit(1);
        });
}

module.exports = { sendCompleteNewsletter, sendExistingNewsletter };
