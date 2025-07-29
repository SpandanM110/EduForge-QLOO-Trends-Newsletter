"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function EmailPreviewPage() {
  const [emailHTML, setEmailHTML] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const generatePreview = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/send-test-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "preview@example.com",
          name: "Preview User",
          categories: ["artists", "trends", "movies"],
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Extract the full HTML from the response
        const fullResponse = await fetch("/api/generate-newsletter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categories: ["artists", "trends", "movies"],
          }),
        })

        const newsletterData = await fullResponse.json()
        if (newsletterData.success) {
          // Generate HTML for preview
          const { generateNewsletterEmailHTML } = await import("@/lib/email-template")
          const html = generateNewsletterEmailHTML(newsletterData.articles, "Preview User")
          setEmailHTML(html)
        }
      }
    } catch (error) {
      console.error("Error generating preview:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Email Newsletter Preview</CardTitle>
          <CardDescription>See how your newsletter will look in email clients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={generatePreview} disabled={isLoading} className="flex items-center gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Generating..." : "Generate Preview"}
          </Button>

          {emailHTML && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 text-sm font-medium">Email Preview</div>
              <div className="max-h-96 overflow-y-auto">
                <iframe srcDoc={emailHTML} className="w-full h-96 border-0" title="Email Preview" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
