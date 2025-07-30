const { emailService } = require('./lib/email-service.js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Initialize Resend with your API key
// const resend = new Resend('re_PbnXKLLU_JwdFB1ckERvtm7fsNmuqgK4y');

// Sample newsletter data (similar to what your generator creates)
const sampleNewsletterData = {
    user: {
        name: 'Test User',
        email: 'parashartanish22@gmail.com', // Use your email for testing
        categories: ['artists', 'trends', 'movies']
    },
    newsletter: {
        title: 'Your Weekly Culture & Trends Digest',
        subtitle: 'Discover what\'s trending in music, movies, and culture',
        articles: [
            {
                title: 'The Evolution of Music in the Digital Age',
                content: 'Digital platforms have revolutionized how we discover and consume music...',
                excerpt: 'Exploring how streaming and AI are reshaping the music industry.',
                category: 'Artists',
                read_time: '3 min read',
                trending: true,
                tags: ['music', 'digital', 'streaming'],
                image_url: 'https://via.placeholder.com/600x400/EC4899/ffffff?text=Music+Trends'
            },
            {
                title: 'Digital Culture Shapes Tomorrow\'s World',
                content: 'From viral TikTok dances to meme culture, digital trends are influencing...',
                excerpt: 'How digital culture is shaping global conversations and movements.',
                category: 'Trends',
                read_time: '4 min read',
                trending: true,
                tags: ['culture', 'digital', 'trends'],
                image_url: 'https://via.placeholder.com/600x400/10B981/ffffff?text=Cultural+Trends'
            },
            {
                title: 'Cinema\'s Renaissance in the Streaming Era',
                content: 'The movie industry is experiencing a renaissance thanks to streaming platforms...',
                excerpt: 'How streaming platforms are revolutionizing film distribution and creation.',
                category: 'Movies',
                read_time: '5 min read',
                trending: false,
                tags: ['movies', 'streaming', 'entertainment'],
                image_url: 'https://via.placeholder.com/600x400/7C3AED/ffffff?text=Movie+Trends'
            }
        ]
    }
};

// Generate HTML email template
function generateEmailHTML(data) {
    const { user, newsletter } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${newsletter.title}</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .welcome {
            font-size: 18px;
            color: #4a5568;
            margin-bottom: 10px;
        }
        .categories {
            display: flex;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        .category-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        .article {
            margin-bottom: 30px;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            background-color: #f8fafc;
        }
        .article-title {
            font-size: 20px;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 10px;
        }
        .article-meta {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
            font-size: 14px;
            color: #718096;
        }
        .trending {
            background: #fef5e7;
            color: #d69e2e;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }
        .article-excerpt {
            color: #4a5568;
            font-style: italic;
            margin-bottom: 15px;
        }
        .article-content {
            color: #2d3748;
            line-height: 1.7;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #718096;
            font-size: 14px;
        }
        .unsubscribe {
            color: #667eea;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🎬 Qloo Trends</div>
            <div class="welcome">Hey ${user.name}! 👋</div>
            <p>Here's your personalized newsletter based on your interests</p>
            <div class="categories">
                ${user.categories.map(cat => `<span class="category-badge">${cat}</span>`).join('')}
            </div>
        </div>

        <h2 style="color: #2d3748; margin-bottom: 20px;">${newsletter.title}</h2>
        <p style="color: #718096; font-size: 16px; margin-bottom: 30px;">${newsletter.subtitle}</p>

        ${newsletter.articles.map(article => `
            <div class="article">
                <div class="article-title">${article.title}</div>
                <div class="article-meta">
                    <span>${article.category}</span>
                    <span>•</span>
                    <span>${article.read_time}</span>
                    ${article.trending ? '<span class="trending">🔥 Trending</span>' : ''}
                </div>
                <div class="article-excerpt">${article.excerpt}</div>
                <div class="article-content">${article.content.substring(0, 200)}...</div>
            </div>
        `).join('')}

        <div class="footer">
            <p>Thanks for subscribing to Qloo Trends! 🎉</p>
            <p>This newsletter was generated using AI and real-time trend data.</p>
            <p><a href="#" class="unsubscribe">Unsubscribe</a> | <a href="#" class="unsubscribe">Manage Preferences</a></p>
        </div>
    </div>
</body>
</html>`;
}

// Main test function
async function sendTestEmail() {
    try {
        console.log('📧 Starting email test...');

        const htmlContent = generateEmailHTML(sampleNewsletterData);

        console.log('📤 Sending test email via Resend...');

        const result = await emailService.sendEmail({
            to: sampleNewsletterData.user.email,
            subject: `${sampleNewsletterData.newsletter.title} - Week of ${new Date().toLocaleDateString()}`,
            html: htmlContent,
        });

        if (result) {
            console.log('✅ Email sent successfully!');
            console.log('📧 Email ID:', result.id);
            console.log('📬 Sent to:', sampleNewsletterData.user.email);
        } else {
            console.error('❌ Failed to send email.');
        }

        return result;
    } catch (error) {
        console.error('❌ Error sending email:', error);

        if (error.message?.includes('403') || error.message?.includes('domain')) {
            console.log('💡 Note: You may need to verify your domain in Resend dashboard');
            console.log('💡 For testing, use onboarding@resend.dev or verify your domain');
        }

        throw error;
    }
}

// Run the test
if (require.main === module) {
    sendTestEmail()
        .then(() => {
            console.log('🎉 Test completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Test failed:', error);
            process.exit(1);
        });
}

module.exports = { sendTestEmail, generateEmailHTML };