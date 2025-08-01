"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  RefreshCw,
  ExternalLink,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  Music,
  Film,
  Book,
  Tv,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface NewsletterArticle {
  title: string
  content: string
  category: string
  image_url?: string
  trending: boolean
  affinity_score?: number
  demographic_insights?: string
  read_time?: string
  excerpt?: string
  tags?: string[]
}

export function NewsletterPreview() {
  const [articles, setArticles] = useState<NewsletterArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null)
  const router = useRouter()

  // Default categories for preview
  const selectedCategories = ["artists", "trends", "movies"]

  const generateNewsletter = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("🚀 Generating newsletter preview for categories:", selectedCategories)

      const response = await fetch("/api/preview-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categories: selectedCategories,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to generate newsletter: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.articles) {
        setArticles(data.articles)
        setLastGenerated(new Date())

        // Cache articles for the article reader
        sessionStorage.setItem("preview-articles", JSON.stringify(data.articles))
        sessionStorage.setItem("preview-articles-timestamp", new Date().toISOString())

        console.log(`✅ Newsletter generated with ${data.articles.length} articles`)
      } else {
        throw new Error(data.error || "Failed to generate newsletter")
      }
    } catch (error) {
      console.error("❌ Newsletter generation failed:", error)
      setError(error instanceof Error ? error.message : "Failed to generate newsletter")
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate on component mount
  useEffect(() => {
    generateNewsletter()
  }, [])

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

  const openFullScreenArticle = (index: number) => {
    // Ensure articles are cached before navigation
    if (articles.length > 0) {
      sessionStorage.setItem("preview-articles", JSON.stringify(articles))
      sessionStorage.setItem("preview-articles-timestamp", new Date().toISOString())
      router.push(`/preview-article/${index}`)
    }
  }

  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Generation Failed</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={generateNewsletter} className="bg-red-600 hover:bg-red-700">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">📰 Newsletter Preview</CardTitle>
              <p className="text-gray-600">Live preview of your personalized newsletter content</p>
            </div>
            <Button onClick={generateNewsletter} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Dashboard */}
      {articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Articles</p>
                  <p className="text-2xl font-bold text-blue-800">{articles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Trending</p>
                  <p className="text-2xl font-bold text-green-800">{articles.filter((a) => a.trending).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Read Time</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {articles.reduce((total, article) => {
                      const time = article.read_time?.match(/\d+/)?.[0] || "3"
                      return total + Number.parseInt(time)
                    }, 0)}{" "}
                    min
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-orange-600 font-medium">Categories</p>
                  <p className="text-2xl font-bold text-orange-800">{selectedCategories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Generating Your Newsletter...</h3>
            <p className="text-gray-600">Creating personalized content for {selectedCategories.join(", ")}</p>
          </CardContent>
        </Card>
      )}

      {/* Articles */}
      {articles.length > 0 && (
        <div className="space-y-6">
          {articles.map((article, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getCategoryIcon(article.category)}
                    {article.category}
                  </Badge>
                  {article.trending && (
                    <Badge variant="destructive" className="animate-pulse">
                      🔥 Trending
                    </Badge>
                  )}
                  {article.affinity_score && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {Math.round(article.affinity_score * 100)}% Match
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-gray-50">
                    <Clock className="h-3 w-3 mr-1" />
                    {article.read_time || "3 min read"}
                  </Badge>
                </div>

                <CardTitle className="text-xl font-bold leading-tight hover:text-blue-600 transition-colors">
                  {article.title}
                </CardTitle>

                {article.excerpt && (
                  <p className="text-muted-foreground italic leading-relaxed mt-2">{article.excerpt}</p>
                )}
              </CardHeader>

              <CardContent className="p-6">
                {/* Article Image */}
                {article.image_url && (
                  <div className="mb-4">
                    <img
                      src={article.image_url || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-48 rounded-lg object-cover shadow-md"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                )}

                {/* Article Preview */}
                <div className="prose prose-sm max-w-none mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {article.content.split("\n\n")[0].substring(0, 200)}...
                  </p>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 4).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Separator className="my-4" />

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {article.demographic_insights && (
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Audience Insights Available
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => openFullScreenArticle(index)}
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Full Screen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer Info */}
      {lastGenerated && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">
              Newsletter generated at {lastGenerated.toLocaleTimeString()} • Click refresh to generate new content
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
