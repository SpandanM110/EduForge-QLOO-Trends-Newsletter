import { NextRequest, NextResponse } from "next/server";
import { newsletterService } from "@/lib/newsletter-service";
import { emailService } from "@/lib/email-service";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Starting weekly newsletter send...");

    // Get all unique category combinations from users
    const allUsers = await prisma.user.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (allUsers.length === 0) {
      return NextResponse.json(
        {
          message: "No users found to send newsletters to",
        },
        { status: 404 }
      );
    }

    // Group users by their category combinations
    const userGroups = new Map<string, any[]>();

    for (const user of allUsers) {
      const userCategories = user.categories
        .map((uc: any) => uc.category.name)
        .sort(); // Sort for consistent grouping

      const categoryKey = userCategories.join(",");

      if (!userGroups.has(categoryKey)) {
        userGroups.set(categoryKey, []);
      }
      userGroups.get(categoryKey)?.push(user);
    }

    console.log(`📊 Found ${userGroups.size} unique category combinations`);

    let totalSent = 0;
    let errors: any[] = [];

    // Process each unique category combination
    for (const [categoryKey, users] of userGroups) {
      const categories = categoryKey.split(",");

      try {
        console.log(
          `📰 Processing newsletter for categories: ${categories.join(", ")} (${
            users.length
          } users)`
        );

        // Get or create newsletter for these categories
        const { newsletter, htmlContent } =
          await newsletterService.getOrCreateNewsletter(categories);

        // Send to all users in this group
        for (const user of users) {
          try {
            // Check if already sent
            const alreadySent = await newsletterService.wasNewsletterSent(
              user.id,
              newsletter.id
            );

            if (alreadySent) {
              console.log(`⏭️  Newsletter already sent to ${user.email}`);
              continue;
            }

            // Send email
            await emailService.sendEmail({
              to: user.email,
              subject: newsletter.title,
              html: htmlContent,
            });

            // Mark as sent
            await newsletterService.markNewsletterSent(user.id, newsletter.id);

            totalSent++;
            console.log(`✅ Sent newsletter to ${user.email}`);

            // Small delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 100));
          } catch (userError) {
            console.error(`❌ Failed to send to ${user.email}:`, userError);
            errors.push({
              user: user.email,
              error:
                userError instanceof Error
                  ? userError.message
                  : "Unknown error",
            });
          }
        }
      } catch (categoryError) {
        console.error(
          `❌ Failed to process categories ${categories.join(", ")}:`,
          categoryError
        );
        errors.push({
          categories: categories.join(", "),
          error:
            categoryError instanceof Error
              ? categoryError.message
              : "Unknown error",
        });
      }
    }

    console.log(
      `🎉 Weekly newsletter send complete! Sent: ${totalSent}, Errors: ${errors.length}`
    );

    return NextResponse.json({
      success: true,
      message: "Weekly newsletters sent successfully",
      stats: {
        totalSent,
        errorCount: errors.length,
        groupsProcessed: userGroups.size,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("❌ Weekly newsletter send failed:", error);
    return NextResponse.json(
      {
        error: "Failed to send weekly newsletters",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// You can also call this as GET for testing
export async function GET() {
  return POST(
    new NextRequest("http://localhost/api/send-weekly-newsletter", {
      method: "POST",
    })
  );
}
