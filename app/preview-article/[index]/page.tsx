"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Music, Film, TrendingUp, Book, Tv, AlertCircle, Loader2 } from "lucide-react"
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

export default function PreviewArticleReaderPage({
  params,
}: {
  params: Promise<{ index: string }>
}) {
  const [article, setArticle] = useState<NewsletterArticle | null>(null)
  const [articles, setArticles] = useState<NewsletterArticle[]>([])
  const [articleIndex, setArticleIndex] = useState<number>(0)
  const [isFromCache, setIsFromCache] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const resolvedParams = await params
        const index = Number.parseInt(resolvedParams.index)
        setArticleIndex(index)

        console.log(`🔍 Loading article ${index}...`)

        // First, try to load from cache
        const cachedArticles = sessionStorage.getItem("preview-articles")
        const cachedTimestamp = sessionStorage.getItem("preview-articles-timestamp")

        if (cachedArticles) {
          try {
            const parsedArticles = JSON.parse(cachedArticles)
            console.log(`✅ Found ${parsedArticles.length} cached articles`)

            setArticles(parsedArticles)
            setIsFromCache(true)

            if (parsedArticles[index]) {
              setArticle(parsedArticles[index])
              console.log(`✅ Loaded cached article: "${parsedArticles[index].title}"`)
              setIsLoading(false)
              return
            }
          } catch (cacheError) {
            console.log("⚠️ Error parsing cached articles:", cacheError)
          }
        }

        // If no cached data or article not found, generate fresh content
        console.log("🔄 No cached data found, generating fresh newsletter content...")

        const response = await fetch("/api/preview-newsletter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categories: ["artists", "trends", "movies"], // Default categories
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch newsletter: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.articles && data.articles.length > 0) {
          console.log(`✅ Generated ${data.articles.length} fresh articles`)

          // Cache the fresh articles
          sessionStorage.setItem("preview-articles", JSON.stringify(data.articles))
          sessionStorage.setItem("preview-articles-timestamp", new Date().toISOString())

          setArticles(data.articles)
          setIsFromCache(false)

          if (data.articles[index]) {
            setArticle(data.articles[index])
            console.log(`✅ Loaded fresh article: "${data.articles[index].title}"`)
          } else {
            // If requested index doesn't exist, show the first article
            setArticle(data.articles[0])
            setArticleIndex(0)
            console.log(`⚠️ Article ${index} not found, showing first article instead`)
          }
        } else {
          throw new Error("No articles found in response")
        }
      } catch (error) {
        console.error("❌ Error loading article:", error)
        setError(error instanceof Error ? error.message : "Failed to load article")
      } finally {
        setIsLoading(false)
      }
    }

    loadArticle()
  }, [params])

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Loading Article...</h2>
              <p className="text-blue-700">{isFromCache ? "Loading from cache..." : "Generating fresh content..."}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Article</h2>
              <p className="text-red-700 mb-6">{error || "Article content could not be loaded at this time."}</p>
              <div className="space-y-4">
                <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
                  Try Again
                </Button>
                <Button onClick={() => router.push("/")} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Newsletter Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Newsletter Preview
          </Button>

          {/* Cache indicator */}
          <div
            className={`text-xs px-3 py-1 rounded-full inline-block ${
              isFromCache ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"
            }`}
          >
            {isFromCache ? "✅ Viewing cached content from preview" : "🆕 Fresh content generated"}
          </div>
        </div>

        {/* Article */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                {getCategoryIcon(article.category)}
                {article.category}
              </Badge>
              {article.trending && <Badge variant="destructive">Trending</Badge>}
              {article.affinity_score && (
                <Badge variant="outline">{Math.round(article.affinity_score * 100)}% Affinity</Badge>
              )}
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {article.read_time || "3 min read"}
              </Badge>
            </div>

            <CardTitle className="text-3xl font-bold leading-tight mb-4">{article.title}</CardTitle>

            {article.excerpt && (
              <p className="text-lg text-muted-foreground italic leading-relaxed bg-white p-4 rounded-md border-l-4 border-blue-200">
                {article.excerpt}
              </p>
            )}

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="inline-block bg-white text-gray-600 text-sm px-3 py-1 rounded-full border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent className="p-8">
            {/* Article Image */}
            {article.image_url && (
              <div className="mb-8">
                <img
                  src={article.image_url || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-96 rounded-lg object-cover shadow-lg"
                  onError={(e) => {
                    // Hide image if it fails to load
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {article.content.split("\n\n").map((paragraph, pIndex) => (
                <p key={pIndex} className="mb-6 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Demographic Insights */}
            {article.demographic_insights && (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mt-8">
                <h4 className="font-semibold text-blue-800 mb-3 text-lg">🎯 Audience Insights</h4>
                <p className="text-blue-700 leading-relaxed">{article.demographic_insights}</p>
              </div>
            )}

            {/* Navigation to other articles */}
            {articles.length > 1 && (
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-semibold mb-4">Other Articles in This Newsletter ({articles.length} total)</h4>
                <div className="grid gap-3">
                  {articles.map((otherArticle, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        index === articleIndex
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                      }`}
                      onClick={() => {
                        if (index !== articleIndex) {
                          // Navigate to other article using same cached data
                          router.push(`/preview-article/${index}`)
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{otherArticle.title}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" size="sm" className="flex items-center gap-1">
                              {getCategoryIcon(otherArticle.category)}
                              {otherArticle.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {otherArticle.read_time || "3 min read"}
                            </span>
                            {index === articleIndex && (
                              <span className="text-xs text-blue-600 font-medium">Currently Reading</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subscribe CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center">
              <h4 className="font-bold text-xl mb-2">📧 Enjoyed This Article?</h4>
              <p className="mb-4 opacity-90">
                Subscribe to get premium content like this delivered to your inbox every week, personalized to your
                interests.
              </p>
              <Button
                onClick={() => router.push("/")}
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Subscribe Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
