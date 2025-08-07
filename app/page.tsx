import { NewsletterSubscription } from "@/components/newsletter-subscription"
import { NewsletterPreview } from "@/components/newsletter-preview"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Mail, Database, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                EduForge
              </span>{" "}
              Newsletter
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Where Qloo trends forge with AI to educate you. Get personalized insights into entertainment, culture, and
              trending topics that shape our world - delivered as engaging educational content.
            </p>

            {/* Status Indicators */}
            <div className="flex justify-center gap-4 mb-12">
              <Badge variant="secondary" className="px-4 py-2 bg-green-100 text-green-800 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Database Connected
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-blue-100 text-blue-800 border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                AI Processing Active
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-purple-100 text-purple-800 border-purple-200">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                Email Service Ready
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Newsletter Subscription */}
          <div className="space-y-8">
            <NewsletterSubscription />

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Database className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Smart Caching</h3>
                    <p className="text-xs text-blue-700">Optimized delivery</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">Real-time</h3>
                    <p className="text-xs text-purple-700">Live trend data</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Newsletter Preview */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Preview Your Newsletter</h2>
              <p className="text-gray-600 mb-6">
                See what kind of personalized content you'll receive based on your selected interests.
              </p>
            </div>
            <NewsletterPreview />
          </div>
        </div>

        {/* System Features */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Forged by Advanced Technology</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our educational newsletter system forges raw trend data into refined knowledge, combining cutting-edge AI
              with real-time insights for the ultimate learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-0 bg-gradient-to-br from-emerald-50 to-emerald-100">
              <div className="text-center">
                <div className="p-3 bg-emerald-600 rounded-2xl w-fit mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">Qloo Integration</h3>
                <p className="text-emerald-700 text-sm">
                  Real-time trend data from Qloo's comprehensive entertainment and culture database
                </p>
              </div>
            </Card>

            <Card className="p-6 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-center">
                <div className="p-3 bg-blue-600 rounded-2xl w-fit mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">AI Content Generation</h3>
                <p className="text-blue-700 text-sm">
                  Google Gemini AI creates engaging, personalized articles based on trending data
                </p>
              </div>
            </Card>

            <Card className="p-6 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-center">
                <div className="p-3 bg-purple-600 rounded-2xl w-fit mx-auto mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Smart Email Delivery</h3>
                <p className="text-purple-700 text-sm">
                  Resend API integration with intelligent caching and duplicate prevention
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
