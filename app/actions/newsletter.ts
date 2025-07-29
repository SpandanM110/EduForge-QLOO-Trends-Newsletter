"use server"

import { z } from "zod"

const subscriptionSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  categories: z.array(z.string()).min(1, "Please select at least one category"),
})

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const categories = formData.getAll("categories") as string[]

    const validatedData = subscriptionSchema.parse({
      email,
      name: name || undefined,
      categories,
    })

    // Here you would typically save to database
    // For demo purposes, we'll simulate the subscription
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you'd also trigger the first newsletter generation
    console.log("New subscription:", validatedData)

    return {
      success: true,
      message: "Successfully subscribed! You'll receive your first newsletter soon.",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    }
  }
}
