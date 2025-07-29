"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Eye, MapPin, User, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"

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

export default function AdminDashboard() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [articles, setArticles] = useState<NewsletterArticle[]>([])
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)
  const [generationType, setGenerationType] = useState<string>("standard")
  const [expandedArticles, setExpandedArticles] = useState<Set<number>>(new Set())

  // Test email state
  const [testEmail, setTestEmail] = useState("")
  const [testName, setTestName] = useState("")
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  // Advanced options
  const [location, setLocation] = useState("")
  const [usePersonalized, setUsePersonalized] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["artists", "trends", "movies"])

  // EXPANDED CATEGORIES with better descriptions
  const categories = [
    { id: "artists", label: "Artists & Music", description: "Musicians, singers, bands across all genres" },
    { id: "trends", label: "Global Trends", description: "Social media, tech, culture, viral content, lifestyle" },
    { id: "movies", label: "Movies & Cinema", description: "Films, blockbusters, indie cinema, international movies" },
    { id: "books", label: "Books & Literature", description: "Bestsellers, fiction, non-fiction, audiobooks" },
    { id: "tv_shows", label: "TV & Streaming", description: "Series, reality TV, documentaries, streaming content" },
  ]

  useEffect(() => {
    if (articles.length > 0) {
      localStorage.setItem("newsletter-articles", JSON.stringify(articles))
    }
  }, [articles])

  const toggleArticleExpansion = (index: number) => {
    const newExpanded = new Set(expandedArticles)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedArticles(newExpanded)
  }

  const generateNewsletter = async () => {
    setIsGenerating(true)
    try {
      const requestBody: any = {
        categories: selectedCategories,
      }

      if (location.trim()) {
        requestBody.location = location.trim()
      } else if (usePersonalized) {
        requestBody.personalized = true
        requestBody.userPreferences = {
          demographics: ["urn:audience:age:18-34"],
          tags: ["urn:tag:genre:music:pop", "urn:tag:genre:media:action"],
        }
      }

      const response = await fetch("/api/generate-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      if (data.success) {
        setArticles(data.articles)
        setLastGenerated(data.generated_at)
        setGenerationType(data.generation_type || "standard")
        // Reset expanded state when new articles are generated
        setExpandedArticles(new Set())
      }
    } catch (error) {
      console.error("Error generating newsletter:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const sendTestNewsletter = async () => {
    if (!testEmail) {
      setTestResult("Please enter an email address")
      return
    }

    setIsSendingTest(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/send-test-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: testEmail,
          name: testName || undefined,
          categories: selectedCategories,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setTestResult(`✅ Test newsletter sent successfully to ${testEmail}!`)
      } else {
        setTestResult(`❌ Failed to send: ${data.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSendingTest(false)
    }
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, categoryId])
    } else {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId))
    }
  }

  const openEmailPreview = () => {
    window.open("/preview-email", "_blank")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Newsletter Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Generate premium newsletters with 2+ minute reads covering global trends, entertainment, culture, and
          technology
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Newsletter Generation Options</CardTitle>
            <CardDescription>Create premium content with comprehensive articles, images, and insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-4">
              <Label>Content Categories</Label>
              <div className="grid gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={category.id} className="text-sm font-medium">
                        {category.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Options */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location-Based Content
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., New York, Los Angeles, London"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Generate content popular in a specific location</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="personalized"
                    checked={usePersonalized}
                    onCheckedChange={(checked) => setUsePersonalized(checked as boolean)}
                    disabled={!!location.trim()}
                  />
                  <Label htmlFor="personalized" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personalized Recommendations
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">Use demographic insights and user preferences</p>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={generateNewsletter}
                disabled={isGenerating || selectedCategories.length === 0}
                className="flex items-center gap-2"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                {isGenerating ? "Generating Premium Content..." : "Generate Premium Newsletter"}
              </Button>

              {articles.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                    onClick={openEmailPreview}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Preview Email Design
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Send className="h-4 w-4" />
                    Send to Subscribers
                  </Button>
                </>
              )}
            </div>

            {lastGenerated && (
              <div className="text-sm text-muted-foreground space-y-1 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="font-medium text-green-800">✅ Newsletter Generated Successfully!</p>
                <p>Generated: {new Date(lastGenerated).toLocaleString()}</p>
                <div className="flex items-center gap-2">
                  <span>Generation type:</span>
                  <Badge variant="secondary">{generationType}</Badge>
                  <span>Articles: {articles.length}</span>
                  <Badge variant="outline">
                    {articles.reduce((total, article) => total + Number.parseInt(article.read_time || "0"), 0)} total
                    read time
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Email Delivery</CardTitle>
            <CardDescription>Send a test newsletter to your email address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-email">Email Address *</Label>
                <Input
                  id="test-email"
                  type="email"
                  placeholder="your@email.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-name">Name (Optional)</Label>
                <Input
                  id="test-name"
                  type="text"
                  placeholder="Your Name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={sendTestNewsletter}
              disabled={isSendingTest || !testEmail}
              className="flex items-center gap-2"
            >
              {isSendingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isSendingTest ? "Sending..." : "Send Test Newsletter"}
            </Button>

            {testResult && (
              <div
                className={`p-3 rounded-md text-sm ${
                  testResult.includes("✅")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {testResult}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debug & Diagnostics</CardTitle>
            <CardDescription>Test Qloo API connectivity and troubleshoot issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={async () => {
                try {
                  const response = await fetch("/api/debug-qloo")
                  const data = await response.json()
                  console.log("🔍 Debug Results:", data)
                  alert("Debug results logged to console. Check browser developer tools.")
                } catch (error) {
                  console.error("Debug failed:", error)
                  alert("Debug failed. Check console for details.")
                }
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Run API Debug Tests
            </Button>

            <div className="text-xs text-muted-foreground">
              <p>
                <strong>Premium Content Features:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>400-600 word articles (2+ minute reads)</li>
                <li>High-quality images from Qloo API</li>
                <li>Comprehensive insights and analysis</li>
                <li>Professional magazine-style formatting</li>
                <li>Demographic insights and audience data</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {articles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Premium Articles</CardTitle>
              <CardDescription>
                Full-length articles with comprehensive content, images, and insights ({generationType} generation)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {articles.map((article, index) => (
                <div key={index} className="border rounded-lg overflow-hidden bg-gradient-to-br from-white to-gray-50">
                  {/* Article Header */}
                  <div className="p-6 border-b bg-white">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary">{article.category}</Badge>
                        {article.trending && <Badge variant="destructive">Trending</Badge>}
                        {article.affinity_score && (
                          <Badge variant="outline">{Math.round(article.affinity_score * 100)}% Affinity</Badge>
                        )}
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {article.read_time}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/admin/article/${index}`, "_blank")}
                        className="ml-auto"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read Full Article
                      </Button>
                    </div>

                    <h3 className="text-2xl font-bold leading-tight mb-3">{article.title}</h3>

                    {article.excerpt && (
                      <p className="text-muted-foreground italic leading-relaxed bg-gray-50 p-4 rounded-md border-l-4 border-blue-200 mb-4">
                        {article.excerpt}
                      </p>
                    )}

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Article Image */}
                  {article.image_url && (
                    <div className="px-6 pt-4">
                      <img
                        src={article.image_url || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-64 rounded-lg object-cover shadow-md"
                      />
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="p-6">
                    <Collapsible open={expandedArticles.has(index)} onOpenChange={() => toggleArticleExpansion(index)}>
                      <div className="space-y-4">
                        {/* Preview (first 200 characters) */}
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 leading-relaxed">
                            {expandedArticles.has(index)
                              ? article.content.split("\n\n").map((paragraph, pIndex) => (
                                  <span key={pIndex} className="block mb-4">
                                    {paragraph}
                                  </span>
                                ))
                              : `${article.content.substring(0, 200)}...`}
                          </p>
                        </div>

                        {/* Expand/Collapse Button */}
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                            {expandedArticles.has(index) ? (
                              <>
                                <ChevronUp className="h-4 w-4" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4" />
                                Read Full Article ({article.read_time})
                              </>
                            )}
                          </Button>
                        </CollapsibleTrigger>

                        {/* Demographic Insights */}
                        {article.demographic_insights && expandedArticles.has(index) && (
                          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mt-4">
                            <h4 className="font-semibold text-blue-800 mb-2">🎯 Audience Insights</h4>
                            <p className="text-sm text-blue-700">{article.demographic_insights}</p>
                          </div>
                        )}
                      </div>
                    </Collapsible>
                  </div>
                </div>
              ))}

              {/* Summary Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                <h4 className="font-semibold mb-3">📊 Newsletter Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Articles:</span>
                    <div className="font-semibold">{articles.length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Read Time:</span>
                    <div className="font-semibold">
                      {articles.reduce((total, article) => {
                        const minutes = Number.parseInt(article.read_time?.split(" ")[0] || "0")
                        return total + minutes
                      }, 0)}{" "}
                      minutes
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trending Articles:</span>
                    <div className="font-semibold">{articles.filter((a) => a.trending).length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">With Images:</span>
                    <div className="font-semibold">{articles.filter((a) => a.image_url).length}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
