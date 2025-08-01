"use server"

import { z } from "zod"

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  categories: z.array(z.string()).min(1, "At least one category must be selected"),
})

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const categories = formData.getAll("categories") as string[]

    // Validate the data
    const validatedData = subscribeSchema.parse({
      email,
      name: name || undefined,
      categories,
    })

    console.log("📝 Newsletter subscription:", validatedData)

    // Call the optimized newsletter API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/send-test-newsletter-optimized`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      },
    )

    const result = await response.json()

    if (response.ok && result.success) {
      return {
        success: true,
        message: result.message || "Successfully subscribed! Check your email.",
        data: result,
      }
    } else {
      return {
        success: false,
        message: result.error || "Failed to subscribe. Please try again.",
      }
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0]?.message || "Invalid input data",
      }
    }

    return {
      success: false,
      message: "An error occurred. Please try again later.",
    }
  }
}
