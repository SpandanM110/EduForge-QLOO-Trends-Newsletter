import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email-service";
import { newsletterService } from "@/lib/newsletter-service";

const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
});

export async function POST(request: NextRequest) {
  try {
    console.log("📝 Processing newsletter subscription...");

    // Parse and validate request body
    const body = await request.json();
    const validatedData = subscriptionSchema.parse(body);

    console.log(
      `👤 New subscription: ${
        validatedData.email
      }, categories: ${validatedData.categories.join(", ")}`
    );

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (user) {
      console.log(`✅ User already exists: ${user.email}`);

      // Update user's categories if different
      const existingCategories = user.categories
        .map((uc: any) => uc.category.name)
        .sort();
      const newCategories = [...validatedData.categories].sort();

      if (
        JSON.stringify(existingCategories) !== JSON.stringify(newCategories)
      ) {
        console.log("🔄 Updating user categories...");

        // Remove old category associations
        await prisma.userCategory.deleteMany({
          where: { userId: user.id },
        });

        // Add new category associations
        for (const categoryName of validatedData.categories) {
          const category = await prisma.category.upsert({
            where: { name: categoryName },
            update: {},
            create: {
              name: categoryName,
              label:
                categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
            },
          });

          await prisma.userCategory.create({
            data: {
              userId: user.id,
              categoryId: category.id,
            },
          });
        }

        // Refresh user data
        user = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            categories: {
              include: {
                category: true,
              },
            },
          },
        });
      }
    } else {
      console.log("🆕 Creating new user...");

      // Create new user
      user = await prisma.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

      // Add category associations
      for (const categoryName of validatedData.categories) {
        const category = await prisma.category.upsert({
          where: { name: categoryName },
          update: {},
          create: {
            name: categoryName,
            label: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
          },
        });

        await prisma.userCategory.create({
          data: {
            userId: user.id,
            categoryId: category.id,
          },
        });
      }

      // Refresh user data with categories
      user = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });
    }

    if (!user) {
      throw new Error("Failed to create or retrieve user");
    }

    console.log("📰 Getting newsletter for user...");

    // Get or create newsletter for user's categories using the service
    const { newsletter, htmlContent } =
      await newsletterService.getUserNewsletter(user.id);

    console.log(`✅ Newsletter ready: ${newsletter.title}`);

    // Check if we already sent this newsletter to this user
    const alreadySent = await newsletterService.wasNewsletterSent(
      user.id,
      newsletter.id
    );

    if (alreadySent) {
      console.log("⚠️  Newsletter already sent to this user this week");
      return NextResponse.json({
        success: true,
        message:
          "Subscription confirmed! You've already received this week's newsletter.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          categories: user.categories.map((uc: any) => uc.category.name),
        },
        newsletter: {
          id: newsletter.id,
          title: newsletter.title,
          alreadySent: true,
        },
      });
    }

    // Send welcome email with newsletter
    console.log("📧 Sending welcome email...");

    await emailService.sendEmail({
      to: user.email,
      subject: newsletter.title,
      html: htmlContent,
    });

    // Mark newsletter as sent
    await newsletterService.markNewsletterSent(user.id, newsletter.id);

    console.log("🎉 Newsletter subscription and email sent successfully!");

    return NextResponse.json({
      success: true,
      message:
        "Subscription successful! Check your email for the latest newsletter.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        categories: user.categories.map((uc: any) => uc.category.name),
      },
      newsletter: {
        id: newsletter.id,
        title: newsletter.title,
        articlesCount: Array.isArray(newsletter.articles)
          ? newsletter.articles.length
          : 0,
      },
    });
  } catch (error) {
    console.error("❌ Newsletter subscription failed:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to process newsletter subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
