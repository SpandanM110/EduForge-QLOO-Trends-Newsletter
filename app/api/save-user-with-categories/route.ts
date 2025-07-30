import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  categories: z
    .array(z.string())
    .min(1, "At least one category must be selected"),
  timestamp: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = subscribeSchema.parse(body);

    console.log("📝 Newsletter subscription request:", validatedData);

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: { categories: { include: { category: true } } },
    });

    if (user) {
      // User exists, update their categories
      // First, remove existing categories
      await prisma.userCategory.deleteMany({
        where: { userId: user.id },
      });

      // Update user name if provided
      if (validatedData.name) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name: validatedData.name },
          include: { categories: { include: { category: true } } },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name || null,
        },
        include: { categories: { include: { category: true } } },
      });
    }

    // Get category IDs from category names
    const categories = await prisma.category.findMany({
      where: {
        name: {
          in: validatedData.categories,
        },
      },
    });

    if (categories.length !== validatedData.categories.length) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more categories not found",
        },
        { status: 400 }
      );
    }

    // Create user-category relationships
    const userCategoryData = categories.map((category) => ({
      userId: user.id,
      categoryId: category.id,
    }));

    await prisma.userCategory.createMany({
      data: userCategoryData,
    });

    // Fetch the updated user with categories
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    console.log("✅ User saved successfully:", {
      id: updatedUser?.id,
      email: updatedUser?.email,
      categories: updatedUser?.categories.map((uc) => uc.category.label),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter!",
        data: {
          user: {
            id: updatedUser?.id,
            email: updatedUser?.email,
            name: updatedUser?.name,
            categories: updatedUser?.categories.map((uc) => ({
              id: uc.category.id,
              name: uc.category.name,
              label: uc.category.label,
              icon: uc.category.icon,
            })),
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Newsletter subscription error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
