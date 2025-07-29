"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink } from "lucide-react"
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

export default function ArticleReaderPage({ params }: { params: { index: string } }) {
  const [article, setArticle] = useState<NewsletterArticle | null>(null)
  const [articles, setArticles] = useState<NewsletterArticle[]>([])
  const router = useRouter()
  const articleIndex = Number.parseInt(params.index)

  useEffect(() => {
    // In a real app, you'd fetch from an API or state management
    // For now, we'll try to get from localStorage or session storage
    const storedArticles = localStorage.getItem("newsletter-articles")
    if (storedArticles) {
      const parsedArticles = JSON.parse(storedArticles)
      setArticles(parsedArticles)
      if (parsedArticles[articleIndex]) {
        setArticle(parsedArticles[articleIndex])
      }
    }
  }, [articleIndex])

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Article not found or no articles generated yet.</p>
            <Button onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/admin")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Button>
        </div>

        {/* Article */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Badge variant="secondary">{article.category}</Badge>
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
                <h4 className="font-semibold mb-4">Other Articles in This Newsletter</h4>
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
                          router.push(`/admin/article/${index}`)
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{otherArticle.title}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" size="sm">
                              {otherArticle.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{otherArticle.read_time}</span>
                          </div>
                        </div>
                        {index !== articleIndex && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
