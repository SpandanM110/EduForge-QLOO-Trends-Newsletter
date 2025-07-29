"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Music, Film, TrendingUp, Book, Tv, AlertCircle } from "lucide-react"
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
  const router = useRouter()

  useEffect(() => {
    const loadFromCache = async () => {
      const resolvedParams = await params
      const index = Number.parseInt(resolvedParams.index)
      setArticleIndex(index)

      console.log(`🔍 Loading article ${index} from cache...`)

      // ONLY use cached articles - never fetch fresh content
      try {
        const cachedArticles = sessionStorage.getItem("preview-articles")
        const cachedTimestamp = sessionStorage.getItem("preview-articles-timestamp")

        if (cachedArticles) {
          const parsedArticles = JSON.parse(cachedArticles)
          console.log(`✅ Found ${parsedArticles.length} cached articles`)

          setArticles(parsedArticles)
          setIsFromCache(true)

          if (parsedArticles[index]) {
            setArticle(parsedArticles[index])
            console.log(`✅ Loaded article: "${parsedArticles[index].title}"`)
            console.log(`📅 Cache timestamp: ${cachedTimestamp || "Unknown"}`)
          } else {
            console.log(`❌ Article ${index} not found in cache`)
            setArticle(null)
          }
        } else {
          console.log("❌ No cached articles found")
          setArticle(null)
          setIsFromCache(false)
        }
      } catch (error) {
        console.error("❌ Error loading cached articles:", error)
        setArticle(null)
        setIsFromCache(false)
      }
    }

    loadFromCache()
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

  // Show error state if no cached article found
  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-orange-800 mb-2">Article Not Available</h2>
              <p className="text-orange-700 mb-6">
                {isFromCache
                  ? `Article ${articleIndex} was not found in the cached preview content.`
                  : "This article can only be viewed after loading the newsletter preview first."}
              </p>
              <div className="space-y-4">
                <Button onClick={() => router.push("/")} className="bg-orange-600 hover:bg-orange-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Newsletter Preview
                </Button>
                <p className="text-sm text-orange-600">
                  💡 Tip: Load the newsletter preview first, then click "Full Screen" to read articles
                </p>
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
          <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
            ✅ Viewing cached content from preview (no regeneration)
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
                {article.read_time}
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
                <h4 className="font-semibold mb-4">Other Articles in This Preview ({articles.length} total)</h4>
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
                            <span className="text-xs text-muted-foreground">{otherArticle.read_time}</span>
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
