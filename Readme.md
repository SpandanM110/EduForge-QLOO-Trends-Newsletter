# 🎵 Qloo Newsletter System

A sophisticated AI-powered newsletter system that delivers personalized entertainment and cultural insights using Qloo's trend data and Google's Gemini AI.

![Newsletter System](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38B2AC)

## 🌟 Features

### 🤖 AI-Powered Content Generation
- **Google Gemini Integration**: Advanced AI generates engaging 400-600 word articles
- **Real-time Trend Analysis**: Leverages Qloo API for current entertainment trends
- **Personalized Content**: Tailored articles based on user preferences and demographics
- **Multiple Categories**: Music, Movies, TV Shows, Books, and Cultural Trends

### 📧 Advanced Email System
- **Beautiful HTML Templates**: Professional newsletter design with responsive layouts
- **Resend Integration**: Reliable email delivery with fallback simulation mode
- **Smart Caching**: Prevents duplicate newsletters and optimizes performance
- **Subscription Management**: Complete user preference and category management

### 🗄️ Database & Performance
- **PostgreSQL with Prisma**: Robust data management and type safety
- **Intelligent Caching**: Newsletter deduplication and performance optimization
- **User Management**: Complete subscription and preference tracking
- **Analytics Ready**: Built-in tracking for newsletter performance

### 🎨 Modern UI/UX
- **Next.js 15**: Latest React features with App Router
- **Tailwind CSS**: Beautiful, responsive design system
- **shadcn/ui Components**: Professional UI component library
- **Real-time Preview**: Live newsletter preview functionality

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Qloo API access
- Google Gemini API key
- Resend account (for email delivery)

### 1. Clone & Install

\`\`\`bash
git clone https://github.com/yourusername/qloo-newsletter-system.git
cd qloo-newsletter-system
npm install
\`\`\`

### 2. Environment Setup

Create a \`.env\` file in the project root:

\`\`\`env
# AI & Content Generation
GEMINI_API_KEY="your_gemini_api_key_here"

# Email Delivery
RESEND_API_KEY="your_resend_api_key_here"

# Database
DATABASE_URL="your_postgresql_connection_string"

# Optional: App Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
\`\`\`

### 3. Database Setup

\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Optional: View database in Prisma Studio
npx prisma studio
\`\`\`

### 4. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your newsletter system!

## 🔧 Configuration

### API Keys Setup

#### Qloo API
The system uses a pre-configured Qloo API key for trend data. For production use, obtain your own key from [Qloo](https://qloo.com).

#### Google Gemini AI
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to your \`.env\` file as \`GEMINI_API_KEY\`

#### Resend Email Service
1. Sign up at [Resend](https://resend.com)
2. Create an API key
3. Add to your \`.env\` file as \`RESEND_API_KEY\`

#### Database (Neon PostgreSQL)
1. Create account at [Neon](https://neon.tech)
2. Create a new database
3. Copy connection string to \`DATABASE_URL\`

## 📖 Usage Guide

### For End Users

#### Subscribing to Newsletter
1. Visit the homepage
2. Select your interests (Artists, Trends, Movies, Books, TV Shows)
3. Enter your email and optional name
4. Click "Subscribe to Newsletter"
5. Check your email for personalized content!

#### Newsletter Features
- **2+ minute read articles** with comprehensive insights
- **Trending indicators** for hot topics
- **Demographic insights** showing audience appeal
- **Beautiful images** generated contextually
- **Mobile-responsive** design for all devices

### For Administrators

#### Admin Dashboard
Access the admin panel at \`/admin\` for:
- **Newsletter Generation**: Create content for specific categories
- **Email Testing**: Send test newsletters to verify delivery
- **Content Preview**: Review articles before sending
- **System Diagnostics**: Check API connections and system health

#### API Endpoints

##### Newsletter Generation
\`\`\`http
POST /api/generate-newsletter
Content-Type: application/json

{
  "categories": ["artists", "trends", "movies"],
  "location": "New York", // optional
  "personalized": true,   // optional
  "userPreferences": {    // optional
    "demographics": ["urn:audience:age:18-34"],
    "tags": ["urn:tag:genre:music:pop"]
  }
}
\`\`\`

##### Newsletter Subscription
\`\`\`http
POST /api/send-test-newsletter-optimized
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "categories": ["artists", "trends"]
}
\`\`\`

##### System Status
\`\`\`http
GET /api/email-status
\`\`\`

## 🧪 Testing

### Email System Testing

Test email delivery:
\`\`\`bash
# Quick email test
node scripts/test-with-env.js

# Complete newsletter flow test
node scripts/test-newsletter-flow.js

# Full system test with multiple scenarios
node scripts/test-email-delivery.js
\`\`\`

### API Testing

Test Qloo integration:
\`\`\`bash
# Test Qloo API connectivity
node scripts/test-qloo-integration.js

# Debug API responses
curl http://localhost:3000/api/debug-qloo
\`\`\`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Gemini 2.0 Flash Lite
- **Email**: Resend API with HTML templates
- **Data**: Qloo Trends & Insights API

### Project Structure
\`\`\`
qloo-newsletter-system/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # API endpoints
│   ├── preview-article/          # Article reader
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── newsletter-preview.tsx    # Newsletter preview
│   └── newsletter-subscription.tsx
├── lib/                          # Core business logic
│   ├── newsletter-generator.ts   # AI content generation
│   ├── qloo-service.ts          # Qloo API integration
│   ├── email-sender.ts          # Email delivery
│   ├── email-template.ts        # HTML email templates
│   └── prisma.ts                # Database client
├── prisma/                       # Database schema
├── scripts/                      # Testing & utility scripts
└── public/                       # Static assets
\`\`\`

### Data Flow
1. **User subscribes** → Categories stored in database
2. **Newsletter generation** → Qloo API provides trend data
3. **AI processing** → Gemini creates engaging articles
4. **Email delivery** → Resend sends beautiful HTML newsletters
5. **Analytics** → Track delivery and engagement

## 🔒 Security & Privacy

### Data Protection
- **Minimal data collection**: Only email, name, and preferences
- **Secure storage**: PostgreSQL with encrypted connections
- **API key protection**: Environment variables only
- **No tracking**: Privacy-focused design

### Email Security
- **SPF/DKIM**: Proper email authentication via Resend
- **Unsubscribe links**: Easy opt-out mechanism
- **Rate limiting**: Prevents spam and abuse
- **Fallback modes**: Graceful degradation when services are unavailable

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
\`\`\`env
GEMINI_API_KEY="your_production_gemini_key"
RESEND_API_KEY="your_production_resend_key"
DATABASE_URL="your_production_database_url"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
\`\`\`

### Database Migration
\`\`\`bash
# Production database setup
npx prisma migrate deploy
npx prisma generate
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/amazing-feature\`
3. Make your changes and test thoroughly
4. Commit with conventional commits: \`git commit -m 'feat: add amazing feature'\`
5. Push to your branch: \`git push origin feature/amazing-feature\`
6. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 📊 Performance

### Optimization Features
- **Smart caching**: Prevents duplicate newsletter generation
- **Database indexing**: Optimized queries for user and newsletter data
- **Image optimization**: SVG generation for reliable image delivery
- **Lazy loading**: Efficient component loading
- **API rate limiting**: Respectful API usage

### Monitoring
- **Error tracking**: Comprehensive error handling and logging
- **Performance metrics**: Built-in performance monitoring
- **Email analytics**: Delivery and engagement tracking
- **System health checks**: Automated status monitoring

## 🆘 Troubleshooting

### Common Issues

#### Email Not Sending
1. Check \`RESEND_API_KEY\` in \`.env\` file
2. Verify API key has sending permissions
3. Check Resend dashboard for quota limits
4. Run \`node scripts/test-with-env.js\` to test

#### Database Connection Issues
1. Verify \`DATABASE_URL\` format
2. Check database server status
3. Run \`npx prisma db push\` to sync schema
4. Test connection with \`npx prisma studio\`

#### AI Content Generation Failing
1. Verify \`GEMINI_API_KEY\` is valid
2. Check API quota and billing
3. Test with \`node scripts/test-qloo-integration.js\`
4. Review error logs in console

#### Newsletter Not Generating
1. Check all environment variables are set
2. Verify database connection
3. Test Qloo API connectivity
4. Check console for detailed error messages

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this README and inline code comments
- **Testing Scripts**: Use provided scripts to diagnose issues
- **Community**: Join discussions in GitHub Discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **Qloo**: For providing comprehensive trend and entertainment data
- **Google**: For Gemini AI capabilities
- **Resend**: For reliable email delivery infrastructure
- **Vercel**: For excellent hosting and deployment platform
- **Open Source Community**: For the amazing tools and libraries

## 📈 Roadmap

### Upcoming Features
- [ ] **Advanced Analytics Dashboard**: Detailed subscriber and engagement metrics
- [ ] **A/B Testing**: Test different newsletter formats and content
- [ ] **Social Media Integration**: Share newsletter content on social platforms
- [ ] **Mobile App**: React Native app for newsletter management
- [ ] **Webhook Support**: Real-time notifications for newsletter events
- [ ] **Multi-language Support**: Internationalization for global audiences
- [ ] **Advanced Personalization**: Machine learning-based content recommendations
- [ ] **Newsletter Templates**: Multiple design templates for different audiences

### Performance Improvements
- [ ] **Redis Caching**: Advanced caching for improved performance
- [ ] **CDN Integration**: Global content delivery for images and assets
- [ ] **Background Jobs**: Queue system for newsletter generation
- [ ] **Real-time Updates**: WebSocket integration for live updates

---

## 🔗 Links

- **Live Demo**: [https://your-demo-url.com](https://your-demo-url.com)
- **Documentation**: [https://docs.your-project.com](https://docs.your-project.com)
- **API Reference**: [https://api.your-project.com](https://api.your-project.com)
- **Status Page**: [https://status.your-project.com](https://status.your-project.com)

---

**Built with ❤️ for the Qloo Hackathon**

*Transforming entertainment data into engaging, personalized newsletters that keep users informed about the latest trends in music, movies, TV, books, and culture.*
\`\`\`

```md project="Qloo Newsletter System" file="LICENSE.md" type="markdown"
# MIT License

Copyright (c) 2024 Qloo Newsletter System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Third-Party Licenses and Acknowledgments

This project uses several third-party libraries and services. We acknowledge and are grateful for their contributions:

### Core Dependencies

#### Next.js
- **License**: MIT License
- **Copyright**: Copyright (c) 2024 Vercel, Inc.
- **Website**: https://nextjs.org/
- **Usage**: React framework for production-grade applications

#### React
- **License**: MIT License
- **Copyright**: Copyright (c) Facebook, Inc. and its affiliates
- **Website**: https://reactjs.org/
- **Usage**: JavaScript library for building user interfaces

#### TypeScript
- **License**: Apache License 2.0
- **Copyright**: Copyright (c) Microsoft Corporation
- **Website**: https://www.typescriptlang.org/
- **Usage**: Typed superset of JavaScript

#### Tailwind CSS
- **License**: MIT License
- **Copyright**: Copyright (c) Tailwind Labs, Inc.
- **Website**: https://tailwindcss.com/
- **Usage**: Utility-first CSS framework

#### Prisma
- **License**: Apache License 2.0
- **Copyright**: Copyright (c) Prisma Data, Inc.
- **Website**: https://www.prisma.io/
- **Usage**: Next-generation ORM for Node.js and TypeScript

### UI Components

#### shadcn/ui
- **License**: MIT License
- **Copyright**: Copyright (c) 2023 shadcn
- **Website**: https://ui.shadcn.com/
- **Usage**: Beautifully designed components built with Radix UI and Tailwind CSS

#### Radix UI
- **License**: MIT License
- **Copyright**: Copyright (c) 2022 WorkOS
- **Website**: https://www.radix-ui.com/
- **Usage**: Low-level UI primitives with accessibility features

#### Lucide React
- **License**: ISC License
- **Copyright**: Copyright (c) 2022 Lucide Contributors
- **Website**: https://lucide.dev/
- **Usage**: Beautiful & consistent icon toolkit

### External Services

#### Qloo API
- **Service Provider**: Qloo, Inc.
- **Website**: https://qloo.com/
- **Usage**: Entertainment and cultural trend data
- **Terms**: Subject to Qloo's Terms of Service and API Usage Guidelines
- **Data**: This application uses Qloo's trend and entertainment data under their API license

#### Google Gemini AI
- **Service Provider**: Google LLC
- **Website**: https://ai.google.dev/
- **Usage**: AI-powered content generation
- **Terms**: Subject to Google's Terms of Service and AI/ML Terms
- **Privacy**: Content generation follows Google's AI Principles

#### Resend
- **Service Provider**: Resend, Inc.
- **Website**: https://resend.com/
- **Usage**: Email delivery service
- **Terms**: Subject to Resend's Terms of Service
- **Privacy**: Email handling follows Resend's Privacy Policy

#### Neon Database
- **Service Provider**: Neon, Inc.
- **Website**: https://neon.tech/
- **Usage**: PostgreSQL database hosting
- **Terms**: Subject to Neon's Terms of Service
- **Data**: Database hosting and management

### Development Dependencies

#### ESLint
- **License**: MIT License
- **Copyright**: Copyright JS Foundation and other contributors
- **Website**: https://eslint.org/
- **Usage**: JavaScript and TypeScript linting

#### Prettier
- **License**: MIT License
- **Copyright**: Copyright (c) James Long and contributors
- **Website**: https://prettier.io/
- **Usage**: Code formatting

#### PostCSS
- **License**: MIT License
- **Copyright**: Copyright 2013 Andrey Sitnik <andrey@sitnik.ru>
- **Website**: https://postcss.org/
- **Usage**: CSS processing and transformation

---

## Data Usage and Privacy

### Qloo Data Usage
This application uses data from Qloo's API to provide entertainment and cultural trend insights. The data is used in accordance with Qloo's API terms and is processed to generate personalized newsletter content.

**Data Types Used:**
- Entertainment entity information (movies, music, TV shows, books)
- Trend data and popularity metrics
- Demographic insights and audience data
- Cultural and entertainment metadata

**Data Processing:**
- Data is fetched in real-time from Qloo's API
- Information is processed by AI to generate human-readable content
- No Qloo data is permanently stored beyond caching for performance
- All data usage complies with Qloo's API guidelines

### User Data Handling
This application collects minimal user data necessary for newsletter delivery:

**Data Collected:**
- Email addresses (for newsletter delivery)
- Names (optional, for personalization)
- Content preferences (selected categories)
- Subscription timestamps

**Data Usage:**
- Email addresses are used solely for newsletter delivery
- Preferences are used to personalize content
- No data is sold or shared with third parties
- Users can unsubscribe at any time

**Data Storage:**
- User data is stored securely in PostgreSQL database
- Database connections are encrypted
- No sensitive data is logged or cached
- Regular data cleanup and maintenance

### AI Content Generation
Content generated by Google's Gemini AI is based on:
- Public trend data from Qloo
- General entertainment and cultural information
- No personal user data is sent to AI services
- Generated content is original and not stored permanently

---

## Compliance and Legal

### GDPR Compliance
This application is designed with privacy in mind and includes features to support GDPR compliance:
- Minimal data collection
- Clear consent mechanisms
- Easy unsubscribe options
- Data portability upon request
- Right to deletion support

### CAN-SPAM Compliance
Email newsletters comply with CAN-SPAM Act requirements:
- Clear sender identification
- Truthful subject lines
- Easy unsubscribe mechanism
- Physical address inclusion
- Prompt unsubscribe processing

### API Terms Compliance
All third-party API usage complies with respective terms of service:
- Qloo API usage follows their guidelines and rate limits
- Google AI usage adheres to their AI Principles and Terms
- Resend email delivery follows their acceptable use policy

---

## Disclaimer

THE SOFTWARE AND SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. THE AUTHORS AND SERVICE PROVIDERS DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

IN NO EVENT SHALL THE AUTHORS OR SERVICE PROVIDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Contact

For questions about licensing, data usage, or compliance:

- **Project Repository**: https://github.com/yourusername/qloo-newsletter-system
- **Issues**: https://github.com/yourusername/qloo-newsletter-system/issues
- **Email**: your-email@example.com

---

**Last Updated**: December 2024

This license file is subject to updates as the project evolves and new dependencies are added. Please check the repository for the most current version.
\`\`\`

```md project="Qloo Newsletter System" file="CONTRIBUTING.md" type="markdown"
# Contributing to Qloo Newsletter System

Thank you for your interest in contributing to the Qloo Newsletter System! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use GitHub Issues to report bugs or request features
- Provide detailed information including steps to reproduce
- Include relevant logs, screenshots, or error messages
- Check existing issues to avoid duplicates

### Submitting Changes
1. Fork the repository
2. Create a feature branch from \`main\`
3. Make your changes with clear, descriptive commits
4. Test your changes thoroughly
5. Submit a pull request with detailed description

### Code Standards
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages using conventional commits
- Include tests for new features
- Update documentation as needed

## 📋 Development Setup

1. Clone your fork
2. Install dependencies: \`npm install\`
3. Set up environment variables
4. Run development server: \`npm run dev\`
5. Run tests: \`npm test\`

## 🧪 Testing Guidelines

- Test all new features and bug fixes
- Use the provided testing scripts
- Ensure email delivery works in both real and simulation modes
- Verify database operations don't break existing data
- Test responsive design on multiple screen sizes

## 📝 Documentation

- Update README.md for new features
- Add inline code comments for complex logic
- Update API documentation for endpoint changes
- Include examples in documentation

## 🔒 Security

- Never commit API keys or sensitive data
- Use environment variables for configuration
- Follow security best practices for database operations
- Report security vulnerabilities privately

## 📞 Getting Help

- Join GitHub Discussions for questions
- Check existing documentation and issues
- Use the testing scripts to diagnose problems
- Reach out to maintainers for guidance

We appreciate all contributions, from bug reports to feature implementations!
\`\`\`

```md project="Qloo Newsletter System" file="CHANGELOG.md" type="markdown"
# Changelog

All notable changes to the Qloo Newsletter System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-XX

### Added
- 🎉 Initial release of Qloo Newsletter System
- 🤖 AI-powered content generation using Google Gemini
- 📊 Qloo API integration for entertainment trends
- 📧 Email delivery system with Resend integration
- 🗄️ PostgreSQL database with Prisma ORM
- 🎨 Modern UI with Next.js 15 and Tailwind CSS
- 👤 User subscription and preference management
- 📱 Responsive design for all devices
- 🔧 Admin dashboard for newsletter management
- 🧪 Comprehensive testing suite
- 📖 Complete documentation and setup guides

### Features
- **Newsletter Generation**: AI creates 400-600 word articles from trend data
- **Multi-Category Support**: Music, Movies, TV, Books, and Cultural Trends
- **Personalization**: Location-based and preference-based content
- **Email Templates**: Beautiful HTML newsletters with responsive design
- **Smart Caching**: Prevents duplicate newsletters and optimizes performance
- **Real-time Preview**: Live newsletter preview functionality
- **Subscription Management**: Complete user preference tracking
- **Testing Tools**: Scripts for testing email delivery and system health

### Technical Highlights
- Next.js 15 with App Router
- TypeScript for type safety
- Prisma for database management
- shadcn/ui for component library
- Comprehensive error handling
- Environment-based configuration
- Production-ready deployment setup

---

## Future Releases

### [1.1.0] - Planned
- [ ] Advanced analytics dashboard
- [ ] A/B testing for newsletter content
- [ ] Social media integration
- [ ] Webhook support for real-time notifications

### [1.2.0] - Planned
- [ ] Mobile app for newsletter management
- [ ] Multi-language support
- [ ] Advanced personalization with ML
- [ ] Newsletter template system

---

*This changelog will be updated with each release to track all changes, improvements, and bug fixes.*
