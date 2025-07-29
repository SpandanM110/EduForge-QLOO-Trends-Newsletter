"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { subscribeToNewsletter } from "@/app/actions/newsletter"
import { useActionState } from "react"
import { Mail, Sparkles, Users, TrendingUp } from "lucide-react"

const categories = [
  {
    id: "artists",
    label: "Artists & Musicians",
    description: "Latest trends in music and artist insights",
    icon: "🎵",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "trends",
    label: "Cultural Trends",
    description: "Emerging trends in entertainment and culture",
    icon: "📈",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "movies",
    label: "Movies & TV",
    description: "Film and television recommendations",
    icon: "🎬",
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "books",
    label: "Books & Literature",
    description: "Literary trends and book recommendations",
    icon: "📚",
    color: "from-red-500 to-orange-500",
  },
]

export function NewsletterSubscription() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["artists", "trends"])
  const [state, action, isPending] = useActionState(subscribeToNewsletter, null)

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, categoryId])
    } else {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId))
    }
  }

  return (
    <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Subscribe to Newsletter</CardTitle>
        </div>
        <CardDescription className="text-base text-gray-600 leading-relaxed">
          Choose your interests and get personalized content delivered weekly to your inbox
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <form action={action} className="space-y-8">
          {/* Email Input */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
            />
          </div>

          {/* Name Input */}
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Name (Optional)
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
            />
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Content Categories
            </Label>
            <div className="grid gap-4">
              {categories.map((category) => (
                <div key={category.id} className="group">
                  <div className="flex items-start space-x-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-200">
                    <Checkbox
                      id={category.id}
                      name="categories"
                      value={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                      className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{category.icon}</span>
                        <Label
                          htmlFor={category.id}
                          className="text-base font-semibold text-gray-900 cursor-pointer group-hover:text-blue-700 transition-colors"
                        >
                          {category.label}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscribe Button */}
          <Button
            type="submit"
            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Subscribing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Subscribe to Newsletter
              </div>
            )}
          </Button>

          {/* Status Messages */}
          {state?.success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">{state.message}</span>
              </div>
            </div>
          )}

          {state?.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 text-red-800">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium">{state.message}</span>
              </div>
            </div>
          )}
        </form>

        {/* Features */}
        <div className="pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">AI-Powered</p>
              <p className="text-xs text-gray-500">Smart content curation</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Real-time</p>
              <p className="text-xs text-gray-500">Latest trend insights</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
