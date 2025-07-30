import { type NextRequest, NextResponse } from "next/server";
import { newsletterGenerator } from "@/lib/newsletter-generator";
import { emailService } from "@/lib/email-service";
import { generateNewsletterEmailHTML } from "@/lib/email-template";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  categories: z
    .array(z.string())
    .min(1, "At least one category must be selected"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const { email, name, categories } = subscribeSchema.parse(body);

    console.log(`📧 Processing newsletter subscription for: ${email}`);
    console.log(`📂 Selected categories: ${categories.join(", ")}`);

    // Step 1: Save user to database with categories
    let user = await prisma.user.findUnique({
      where: { email },
      include: { categories: { include: { category: true } } },
    });

    if (user) {
      console.log(`👤 Existing user found: ${user.email}`);
      // Remove existing categories
      await prisma.userCategory.deleteMany({
        where: { userId: user.id },
      });

      // Update user name if provided
      if (name) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name },
          include: { categories: { include: { category: true } } },
        });
      }
    } else {
      console.log(`� Creating new user: ${email}`);
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name: name || null,
        },
        include: { categories: { include: { category: true } } },
      });
    }

    // Get category records from database
    const categoryRecords = await prisma.category.findMany({
      where: {
        name: {
          in: categories,
        },
      },
    });

    if (categoryRecords.length !== categories.length) {
      return NextResponse.json(
        { error: "One or more categories not found" },
        { status: 400 }
      );
    }

    // Create user-category relationships
    const userCategoryData = categoryRecords.map((category) => ({
      userId: user.id,
      categoryId: category.id,
    }));

    await prisma.userCategory.createMany({
      data: userCategoryData,
    });

    console.log(`✅ User saved with ${categoryRecords.length} categories`);

    // Step 2: Generate welcome email content
    // Step 2: Generate welcome email content
    const articles = await newsletterGenerator.generateNewsletterContent(
      categories
    );

    if (articles.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate newsletter content" },
        { status: 500 }
      );
    }

    // Create welcome email HTML with user's selected categories
    const welcomeHTML = generateWelcomeEmailHTML(
      user.name || "Friend",
      categoryRecords,
      articles
    );
    const subject = `� Welcome to Qloo Trends Newsletter! Here's your first personalized content`;

    // Step 3: Send welcome email using Resend API
    const emailSent = await emailService.sendEmail({
      to: email,
      subject: subject,
      html: welcomeHTML,
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send welcome email" },
        { status: 500 }
      );
    }

    console.log(`✅ Welcome email sent to ${email}`);

    return NextResponse.json({
      success: true,
      message: `Welcome email sent to ${email}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        categories: categoryRecords.map((cat) => ({
          name: cat.name,
          label: cat.label,
          icon: cat.icon,
        })),
      },
      articles_generated: articles.length,
      sent_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error processing newsletter subscription:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
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

// Generate welcome email HTML
function generateWelcomeEmailHTML(
  name: string,
  categories: any[],
  articles: any[]
) {
  const categoryList = categories
    .map(
      (cat) => `
    <div style="display: inline-block; margin: 5px; padding: 10px 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 20px; font-size: 14px;">
      ${cat.icon} ${cat.label}
    </div>
  `
    )
    .join("");

  const articlesList = articles
    .slice(0, 3)
    .map(
      (article) => `
    <div style="margin: 20px 0; padding: 20px; border-left: 4px solid #667eea; background: #f8f9fa;">
      <h3 style="color: #333; margin: 0 0 10px 0;">${article.title}</h3>
      <p style="color: #666; line-height: 1.6;">${article.summary}</p>
      ${
        article.url
          ? `<a href="${article.url}" style="color: #667eea; text-decoration: none;">Read more →</a>`
          : ""
      }
    </div>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Qloo Trends!</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Welcome to Qloo Trends!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Hi ${name}, your personalized content journey starts now!</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          
          <!-- Welcome Message -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #333; margin: 0 0 15px 0;">Thank you for subscribing! 🚀</h2>
            <p style="color: #666; font-size: 16px; margin: 0;">We're excited to deliver personalized content based on your interests.</p>
          </div>

          <!-- Selected Categories -->
          <div style="margin: 30px 0;">
            <h3 style="color: #333; margin: 0 0 15px 0;">📂 Your Selected Categories:</h3>
            <div style="text-align: center;">
              ${categoryList}
            </div>
          </div>

          <!-- Sample Articles -->
          <div style="margin: 30px 0;">
            <h3 style="color: #333; margin: 0 0 20px 0;">🎯 Here's what you can expect:</h3>
            ${articlesList}
          </div>

          <!-- Call to Action -->
          <div style="text-align: center; margin: 40px 0; padding: 30px; background: #f8f9fa; border-radius: 10px;">
            <h3 style="color: #333; margin: 0 0 15px 0;">What's Next? 📅</h3>
            <p style="color: #666; margin: 0 0 20px 0;">You'll receive your weekly personalized newsletter every Sunday with the latest trends and insights tailored to your interests.</p>
            <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 25px; text-decoration: none; font-weight: bold;">
              🎵 Weekly Newsletter Coming Soon!
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Powered by Qloo AI • Personalized just for you<br>
              <span style="font-size: 12px;">You can update your preferences anytime by replying to this email.</span>
            </p>
          </div>

        </div>
      </div>
    </body>
    </html>
  `;
}
