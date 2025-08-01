# Qloo Newsletter System - Eduforge 


<img width="1897" height="575" alt="image" src="https://github.com/user-attachments/assets/cdb49059-f76c-4ead-a5fb-a5e00d28dfe2" />


A sophisticated AI-powered newsletter platform delivering personalized entertainment and cultural insights, powered by Qloo's trend data and Google's Gemini AI.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38B2AC)

---

## 🌟 Features

### 🤖 AI-Powered Content Generation

* Integrates Google Gemini to produce 400–600 word engaging articles.
* Real-time entertainment trend insights via Qloo API.
* Fully personalized articles based on user preferences.
* Supports categories like Music, Movies, TV, Books & Culture.

### 📧 Advanced Email System

* Responsive HTML templates with clean design.
* Uses Resend API for reliable email delivery.
* Smart caching avoids duplicate newsletter generation.
* Full subscription and category management for users.

### 🗒️ Database & Performance

* Uses PostgreSQL and Prisma for robust data management.
* Caching for performance and deduplication.
* Complete tracking of subscriptions and preferences.
* Analytics-ready structure.

### 🎨 Modern UI/UX

* Built on Next.js 15 with App Router.
* Styled using Tailwind CSS and shadcn/ui components.
* Real-time preview of newsletters.

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* PostgreSQL
* Qloo API key
* Google Gemini API key
* Resend API key

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/qloo-newsletter-system.git
cd qloo-newsletter-system
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY="your_gemini_api_key"
RESEND_API_KEY="your_resend_api_key"
DATABASE_URL="your_postgresql_url"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
npx prisma generate
npx prisma db push
npx prisma studio # Optional GUI
```

### 4. Run Locally

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🔧 Configuration

### API Keys

* **Qloo**: [qloo.com](https://qloo.com)
* **Gemini**: [Google AI Studio](https://makersuite.google.com/app/apikey)
* **Resend**: [resend.com](https://resend.com)
* **Database**: [neon.tech](https://neon.tech)

---

## 📖 Usage

### End Users

* Select categories and subscribe.
* Receive tailored newsletters.
* Enjoy rich content, demographic insights, and images.

### Admin Panel (`/admin`)

* Generate and preview newsletters.
* Send test emails.
* Monitor API status and system diagnostics.

### Example API Calls

```http
POST /api/generate-newsletter
{
  "categories": ["movies", "music"],
  "location": "New York",
  "personalized": true
}

POST /api/send-test-newsletter-optimized
{
  "email": "user@example.com",
  "name": "User",
  "categories": ["tv", "books"]
}

GET /api/email-status
```

---

## 🔮 Testing

```bash
node scripts/test-with-env.js
node scripts/test-newsletter-flow.js
node scripts/test-email-delivery.js
```

---

## 📚 Architecture

### Stack

* Frontend: Next.js 15, Tailwind CSS, shadcn/ui
* Backend: Next.js API routes
* AI: Google Gemini 2.0 Flash Lite
* Database: PostgreSQL + Prisma
* Email: Resend API
* Trend Data: Qloo API

### Structure

```
qloo-newsletter-system/
├── app/               # Next.js routes
├── components/        # React components
├── lib/               # Core business logic
├── prisma/            # DB schema
├── scripts/           # Test tools
└── public/            # Assets
```

### Data Flow

1. User subscribes
2. Qloo fetches trends
3. Gemini generates article
4. Resend sends email
5. Stats tracked

---

## 🔒 Security & Privacy

* Minimal data: email, name, preferences
* All API keys stored in env
* GDPR & CAN-SPAM compliant
* Emails have unsubscribe links
* Secure database and encrypted connections

---

## 🚗 Deployment

### Vercel

* Connect repo
* Add env vars
* Deploy

### Production DB

```bash
npx prisma migrate deploy
npx prisma generate
```

---


## 📊 Performance

* Redis-ready caching
* Image optimization
* Rate limiting
* Background jobs and real-time updates (roadmap)

---

## 🚧 Troubleshooting

### Email Not Sending?

* Check `RESEND_API_KEY`
* Validate Resend setup

### AI Not Working?

* Check `GEMINI_API_KEY`
* Verify usage limits

### DB Issues?

* Check `DATABASE_URL`
* Run `prisma db push`

---

## 🔗 Links

* **Live App**: [https://your-demo-url.com](https://your-demo-url.com)
* **Docs**: [https://docs.your-project.com](https://docs.your-project.com)
* **Status**: [https://status.your-project.com](https://status.your-project.com)
* **API**: [https://api.your-project.com](https://api.your-project.com)

---

**Made with ❤️ for the Qloo Hackathon**

*Your entertainment trends, tailored and delivered.*
