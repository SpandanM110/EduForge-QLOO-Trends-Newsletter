"use client"

import type React from "react"
import { Mail } from "lucide-react" // Import Mail icon

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  TrendingUp,
  Music,
  Film,
  Book,
  Tv,
  Loader2,
  RefreshCw,
  ChevronUp,
  Eye,
  ExternalLink,
  Clock,
  Sparkles,
  BarChart3,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NewsletterArticle {
  title: string
  content: string
  category: string
  image_url?: string
  trending: boolean
  source_data: any
  affinity_score?: number
  demographic_insights?: string
  read_time: string
  excerpt: string
  tags: string[]
}

export function NewsletterPreview() {
  const [articles, setArticles] = useState<NewsletterArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [expandedArticles, setExpandedArticles] = useState<Set<number>>(new Set())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const cacheArticles = (articles: NewsletterArticle[]) => {
    try {
      const timestamp = new Date().toISOString()
      sessionStorage.setItem("preview-articles", JSON.stringify(articles))
      sessionStorage.setItem("preview-articles-timestamp", timestamp)
      console.log(`💾 Cached ${articles.length} articles at ${timestamp}`)
      console.log(
        "📋 Cached articles:",
        articles.map((a, i) => `${i}: ${a.title}`),
      )
    } catch (error) {
      console.error("❌ Failed to cache articles:", error)
    }
  }

  const fetchPreviewContent = async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }

    try {
      console.log("🔄 Fetching fresh preview content...")
      const response = await fetch("/api/preview-newsletter", {
        method: "GET",
      })

      const data = await response.json()
      if (data.success && data.articles) {
        console.log(`✅ Received ${data.articles.length} articles from API`)

        setArticles(data.articles)
        const updateTime = new Date().toLocaleString()
        setLastUpdated(updateTime)

        // Cache the exact articles that will be displayed
        cacheArticles(data.articles)

        // Reset expanded state when new content loads
        setExpandedArticles(new Set())

        console.log("🎯 Articles ready for full-screen viewing")
      }
    } catch (error) {
      console.error("❌ Error fetching preview content:", error)
      // Fallback content with bulletproof SVG image
      const fallbackSvg = `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
          <rect width="600" height="400" fill="#F9FAFB"/>
          <rect x="0" y="0" width="600" height="8" fill="#6B7280"/>
          <text x="300" y="180" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="48" fill="#6B7280">🔧</text>
          <text x="300" y="230" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#6B7280">SYSTEM NOTICE</text>
          <text x="300" y="260" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fill="#6B7280" opacity="0.7">Temporary Maintenance</text>
          <rect x="0" y="392" width="600" height="8" fill="#6B7280"/>
        </svg>
      `)}`

      const fallbackArticles = [
        {
          title: "Live Content Temporarily Unavailable",
          content:
            "We're working to restore live content generation. Our AI-powered newsletter system combines real-time trend data from Qloo with advanced content generation to bring you the most relevant insights in music, entertainment, and culture. Please try refreshing in a moment to see fresh content.",
          category: "System Notice",
          trending: false,
          source_data: {},
          read_time: "1 min read",
          excerpt: "Live preview content will be restored shortly with fresh insights from entertainment and culture.",
          tags: ["system", "maintenance", "qloo-api"],
          image_url: fallbackSvg,
        },
      ]
      setArticles(fallbackArticles)
      cacheArticles(fallbackArticles)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPreviewContent()
  }, [])

  const toggleArticleExpansion = (index: number) => {
    const newExpanded = new Set(expandedArticles)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedArticles(newExpanded)
  }

  const openFullScreenReader = (index: number) => {
    try {
      // Double-check caching before opening
      if (articles.length > 0) {
        cacheArticles(articles)
        console.log(`🚀 Opening full-screen reader for article ${index}: "${articles[index]?.title}"`)
        console.log("📝 This will show the EXACT same content as preview")
      }
      window.open(`/preview-article/${index}`, "_blank")
    } catch (error) {
      console.error("❌ Error opening article:", error)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "music & artists":
      case "artists":
        return <Music className="h-4 w-4" />
      case "global trends":
      case "trends":
        return <TrendingUp className="h-4 w-4" />
      case "cinema & film":
      case "movies":
        return <Film className="h-4 w-4" />
      case "literature & books":
      case "books":
        return <Book className="h-4 w-4" />
      case "television & streaming":
      case "tv_shows":
        return <Tv className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "music & artists":
      case "artists":
        return "from-pink-500 to-rose-500"
      case "global trends":
      case "trends":
        return "from-emerald-500 to-teal-500"
      case "cinema & film":
      case "movies":
        return "from-purple-500 to-violet-500"
      case "literature & books":
      case "books":
        return "from-red-500 to-orange-500"
      case "television & streaming":
      case "tv_shows":
        return "from-cyan-500 to-blue-500"
      default:
        return "from-blue-500 to-indigo-500"
    }
  }

  // Enhanced image error handling with fallback generation
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, articleTitle: string, category: string) => {
    const target = e.target as HTMLImageElement
    console.error(`❌ Image error for: ${articleTitle}`)
    console.error(`🔗 Failed URL: ${target.src}`)

    // Generate a simple fallback SVG immediately
    const fallbackSvg = generateFallbackSvg(category)
    target.src = fallbackSvg

    console.log(`🔄 Applied fallback SVG for ${category}`)
  }

  // Generate a simple fallback SVG that will definitely work
  const generateFallbackSvg = (category: string): string => {
    const colors = {
      "music & artists": "#EC4899",
      "global trends": "#10B981",
      "cinema & film": "#7C3AED",
      "literature & books": "#DC2626",
      "television & streaming": "#059669",
    }

    const color = colors[category as keyof typeof colors] || "#6366F1"

    const simpleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <rect width="600" height="400" fill="#F8FAFC"/>
      <rect x="0" y="0" width="600" height="8" fill="${color}"/>
      <circle cx="300" cy="200" r="30" fill="${color}" opacity="0.2"/>
      <text x="300" y="210" textAnchor="middle" fontFamily="Arial" fontSize="24" fill="${color}">✨</text>
      <text x="300" y="240" textAnchor="middle" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="${color}">${category.toUpperCase()}</text>
      <rect x="0" y="392" width="600" height="8" fill="${color}"/>
    </svg>`

    return `data:image/svg+xml,${encodeURIComponent(simpleSvg)}`
  }

  if (isLoading) {
    return (
      <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Newsletter Preview</CardTitle>
          </div>
          <CardDescription className="text-base text-gray-600">Loading live content from Qloo API...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-700">Generating fresh content...</p>
              <p className="text-sm text-gray-500">Fetching trends • Processing with AI • Creating articles</p>
            </div>
            <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                Qloo API
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                Gemini AI
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                Live Data
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Live Newsletter Preview</CardTitle>
              <CardDescription className="text-base text-gray-600 mt-1">
                Real content powered by Qloo API & Gemini AI
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPreviewContent(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 border-gray-200 hover:border-gray-300 rounded-lg"
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {isRefreshing ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Status Indicator */}
        {/* <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-xl">
          <div className="flex items-center gap-3 text-green-700">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Images: 100% Reliable SVG</span>
            <div className="ml-auto flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4" />
         
            </div>
          </div>
          <p className="text-green-600 text-sm mt-2 ml-6">
            All images use bulletproof SVG data URLs - guaranteed to load instantly without errors
          </p>
        </div> */}

        {/* Articles */}
        <div className="space-y-8">
          {articles.map((article, index) => (
            <div key={index} className="group">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
                {/* Article Header */}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${getCategoryColor(article.category)} text-white border-0 shadow-sm`}
                      >
                        {getCategoryIcon(article.category)}
                        <span className="font-medium">{article.category}</span>
                      </Badge>
                      {article.trending && (
                        <Badge
                          variant="destructive"
                          className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 border-0 shadow-sm animate-pulse"
                        >
                          🔥 Trending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 border-gray-200">
                        <Clock className="h-3 w-3" />
                        {article.read_time}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openFullScreenReader(index)}
                        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 rounded-lg"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Full Screen
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold leading-tight text-gray-900 group-hover:text-blue-700 transition-colors">
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-4 rounded-r-xl mt-4">
                      <p className="text-gray-700 italic leading-relaxed font-medium">{article.excerpt}</p>
                    </div>
                  )}

                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {article.tags.slice(0, 4).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardHeader>

                {/* Article Image */}
                {article.image_url && (
                  <div className="px-6 pb-4">
                    <div className="relative group/image overflow-hidden rounded-2xl">
                      <img
                        src={article.image_url || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover/image:scale-105"
                        onLoad={() => {
                          console.log(`✅ Beautiful SVG loaded: ${article.title}`)
                        }}
                        onError={(e) => handleImageError(e, article.title, article.category)}
                      />

                      {/* Image Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                     
                      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-full">
                        <span className="flex items-center gap-1.5 font-medium">
                          {getCategoryIcon(article.category)}
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Image Status */}
                    {/* <div className="mt-4 text-sm bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3 rounded-xl">
                      <div className="flex items-center gap-2 text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <strong>Beautiful SVG Design:</strong>
                        <span className="font-semibold">Custom gradients, modern typography, premium styling</span>
                      </div>
                      <div className="text-green-600 text-xs mt-1 flex items-center gap-4">
                        <span className="flex items-center gap-1">⚡ Instant loading</span>
                        <span className="flex items-center gap-1">🎨 Category-specific colors</span>
                        <span className="flex items-center gap-1">✨ Professional design</span>
                      </div>
                    </div> */}
                  </div>
                )}

                {/* Article Content */}
                <CardContent className="pt-0">
                  <Collapsible open={expandedArticles.has(index)} onOpenChange={() => toggleArticleExpansion(index)}>
                    <div className="space-y-6">
                      {/* Content Preview/Full */}
                      <div className="prose prose-lg max-w-none">
                        {expandedArticles.has(index) ? (
                          // Full content
                          <div className="space-y-4">
                            {article.content.split("\n\n").map((paragraph, pIndex) => (
                              <p key={pIndex} className="text-gray-700 leading-relaxed text-base">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        ) : (
                          // Preview (first 150 characters)
                          <p className="text-gray-700 leading-relaxed text-base">
                            {article.content.substring(0, 150)}...
                          </p>
                        )}
                      </div>

                      {/* Expand/Collapse Button */}
                      <div className="flex gap-3">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200 rounded-lg"
                          >
                            {expandedArticles.has(index) ? (
                              <>
                                <ChevronUp className="h-4 w-4" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4" />
                                Read Full Article ({article.read_time})
                              </>
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>

                      {/* Demographic Insights - Only show when expanded */}
                      <CollapsibleContent>
                        {article.demographic_insights && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl">
                            <h4 className="font-bold text-blue-800 mb-3 text-base flex items-center gap-2">
                              <BarChart3 className="h-4 w-4" />
                              Audience Insights
                            </h4>
                            <p className="text-blue-700 leading-relaxed">{article.demographic_insights}</p>
                          </div>
                        )}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Newsletter Stats */}
        <Card className="border-0 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 shadow-lg">
          <CardContent className="p-6">
            <h4 className="font-bold mb-4 text-lg flex items-center gap-2 text-gray-800">
              <BarChart3 className="h-5 w-5" />
              This Newsletter Issue
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{articles.length}</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {articles.reduce((total, article) => {
                    const minutes = Number.parseInt(article.read_time?.split(" ")[0] || "0")
                    return total + minutes
                  }, 0)}
                </div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{articles.filter((a) => a.trending).length}</div>
                <div className="text-sm text-gray-600">Trending</div>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{new Set(articles.map((a) => a.category)).size}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold">Get This Quality Content Weekly</h4>
              <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
                Subscribe to receive premium articles like these, personalized to your interests, delivered every week.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm opacity-80 pt-4">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI-Powered Content
                </span>
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Personalized Insights
                </span>
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trend Analysis
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 pt-6 border-t border-gray-200 space-y-3">
          <div className="flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Powered by Qloo AI
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Delivered Weekly
            </span>
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Premium Content
            </span>
          </div>
          {lastUpdated && <p className="text-xs text-gray-400">Content generated: {lastUpdated}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
