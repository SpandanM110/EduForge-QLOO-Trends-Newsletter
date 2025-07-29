import type { NewsletterArticle } from "./newsletter-generator"

export function generateNewsletterEmailHTML(articles: NewsletterArticle[], subscriberName?: string): string {
  const greeting = subscriberName ? `Hi ${subscriberName}` : "Hello"

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Qloo Trends Newsletter</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.7;
            color: #2d3748;
            max-width: 680px;
            margin: 0 auto;
            padding: 0;
            background-color: #f7fafc;
        }
        
        .container {
            background-color: #ffffff;
            margin: 20px auto;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        
        .header p {
            margin: 15px 0 0 0;
            opacity: 0.95;
            font-size: 18px;
            font-weight: 300;
        }
        
        .greeting {
            padding: 30px;
            border-bottom: 1px solid #e2e8f0;
            background: #f8fafc;
        }
        
        .greeting h2 {
            margin: 0 0 10px 0;
            font-size: 24px;
            font-weight: 600;
            color: #1a202c;
        }
        
        .greeting p {
            margin: 0;
            font-size: 16px;
            color: #4a5568;
        }
        
        .article {
            padding: 40px 30px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .article:last-child {
            border-bottom: none;
        }
        
        .article-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .category-badge {
            background: #3182ce;
            color: white;
            padding: 6px 16px;
            border-radius: 25px;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .trending-badge {
            background: #e53e3e;
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .read-time {
            background: #edf2f7;
            color: #4a5568;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .article-title {
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 15px 0;
            color: #1a202c;
            line-height: 1.3;
            letter-spacing: -0.5px;
        }
        
        .article-excerpt {
            font-size: 18px;
            color: #4a5568;
            margin: 0 0 25px 0;
            font-style: italic;
            line-height: 1.6;
        }
        
        .article-image {
            width: 100%;
            max-width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 12px;
            margin: 20px 0 25px 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .article-content {
            color: #2d3748;
            line-height: 1.8;
            font-size: 16px;
            margin-bottom: 20px;
        }
        
        .article-content p {
            margin: 0 0 18px 0;
        }
        
        .article-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 20px 0;
        }
        
        .tag {
            background: #f7fafc;
            color: #4a5568;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            border: 1px solid #e2e8f0;
        }
        
        .demographic-insights {
            background: linear-gradient(135deg, #ebf8ff 0%, #f0fff4 100%);
            border-left: 4px solid #3182ce;
            padding: 20px;
            margin: 25px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .demographic-insights h4 {
            margin: 0 0 10px 0;
            font-size: 16px;
            font-weight: 600;
            color: #2b6cb0;
        }
        
        .demographic-insights p {
            margin: 0;
            font-size: 14px;
            color: #2d3748;
            line-height: 1.6;
        }
        
        .footer {
            text-align: center;
            padding: 40px 30px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer h3 {
            margin: 0 0 15px 0;
            font-size: 20px;
            font-weight: 600;
            color: #1a202c;
        }
        
        .footer p {
            margin: 0 0 10px 0;
            color: #4a5568;
            font-size: 14px;
        }
        
        .unsubscribe {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #718096;
        }
        
        .unsubscribe a {
            color: #3182ce;
            text-decoration: none;
        }
        
        .unsubscribe a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 26px;
            }
            
            .article {
                padding: 30px 20px;
            }
            
            .article-title {
                font-size: 24px;
            }
            
            .article-excerpt {
                font-size: 16px;
            }
            
            .article-image {
                height: 200px;
            }
            
            .greeting {
                padding: 20px;
            }
            
            .footer {
                padding: 30px 20px;
            }
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
            <p>Welcome to your curated selection of the most compelling trends and insights shaping our cultural landscape. Each article is crafted for depth and designed to inform and inspire.</p>
        </div>
        
        ${articles
          .map(
            (article) => `
            <div class="article">
                <div class="article-header">
                    <span class="category-badge">${article.category}</span>
                    ${article.trending ? '<span class="trending-badge">TRENDING</span>' : ""}
                    <span class="read-time">${article.read_time}</span>
                </div>
                
                <h2 class="article-title">${article.title}</h2>
                
                ${article.excerpt ? `<p class="article-excerpt">${article.excerpt}</p>` : ""}
                
                ${
                  article.image_url
                    ? `<img src="${article.image_url}" alt="${article.title}" class="article-image" />`
                    : ""
                }
                
                <div class="article-content">
                    ${article.content
                      .split("\n\n")
                      .map((paragraph) => `<p>${paragraph}</p>`)
                      .join("")}
                </div>
                
                ${
                  article.tags && article.tags.length > 0
                    ? `
                    <div class="article-tags">
                        ${article.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                    </div>
                `
                    : ""
                }
                
                ${
                  article.demographic_insights
                    ? `
                    <div class="demographic-insights">
                        <h4>🎯 Audience Insights</h4>
                        <p>${article.demographic_insights}</p>
                    </div>
                `
                    : ""
                }
            </div>
        `,
          )
          .join("")}
        
        <div class="footer">
            <h3>Powered by Qloo AI</h3>
            <p>This premium newsletter combines real-time trend data with AI-powered content generation to deliver insights that matter.</p>
            <p><strong>Next Issue:</strong> Coming next week with fresh perspectives on culture and entertainment.</p>
            
            <div class="unsubscribe">
                <p>
                    <a href="#unsubscribe">Unsubscribe</a> | 
                    <a href="#preferences">Update Preferences</a> | 
                    <a href="#support">Support</a>
                </p>
                <p>© 2024 Qloo Trends Newsletter. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
  `
}
