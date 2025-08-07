'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

const categories = [
  { id: 'artists', label: 'Artists & Musicians', description: 'Trending artists and music insights' },
  { id: 'trends', label: 'Cultural Trends', description: 'Latest cultural movements and phenomena' },
  { id: 'movies', label: 'Movies & TV', description: 'Entertainment industry insights' },
  { id: 'books', label: 'Books & Literature', description: 'Literary trends and recommendations' },
  { id: 'tv_shows', label: 'Television & Streaming', description: 'TV shows and streaming content' },
]

export function NewsletterSubscription() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['artists', 'trends'])
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Email address is required')
      return
    }

    if (selectedCategories.length === 0) {
      setError('Please select at least one category')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Use the current domain for the API call
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://eduforge.live'
      
      const response = await fetch(`${baseUrl}/api/send-test-newsletter-optimized`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: name || undefined,
          categories: selectedCategories,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (data.success) {
        setIsSuccess(true)
        toast.success(data.message || 'Newsletter subscription successful!')
        
        // Reset form
        setEmail('')
        setName('')
        setSelectedCategories(['artists', 'trends'])
      } else {
        throw new Error(data.error || 'Subscription failed')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe to newsletter'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="p-3 bg-green-600 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-2">Welcome to EduForge!</h3>
            <p className="text-green-700">
              Your personalized newsletter is being forged. Check your email for your first educational insights!
            </p>
          </div>
          <Button 
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          >
            Subscribe Another Email
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Join EduForge</CardTitle>
        <CardDescription>
          Get AI-powered educational content from trending entertainment and culture data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">Choose Your Interests</Label>
            <p className="text-sm text-gray-600 mb-4">Select topics you'd like to learn about</p>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={category.id} className="font-medium cursor-pointer">
                      {category.label}
                    </Label>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedCategories.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Selected Categories:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCategories.map((categoryId) => {
                  const category = categories.find(c => c.id === categoryId)
                  return (
                    <Badge key={categoryId} variant="secondary" className="bg-blue-100 text-blue-800">
                      {category?.label}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            disabled={isLoading || selectedCategories.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Forging Your Newsletter...
              </>
            ) : (
              'Forge My Newsletter'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Free forever • No spam • Unsubscribe anytime
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
