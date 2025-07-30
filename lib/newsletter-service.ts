import { prisma } from "@/lib/prisma";
import { newsletterGenerator } from "@/lib/newsletter-generator";
import { generateNewsletterEmailHTML } from "@/lib/email-template";

export class NewsletterService {
  /**
   * Get or create newsletter for specific categories and week
   */
  async getOrCreateNewsletter(
    categories: string[],
    weekOf?: Date
  ): Promise<any> {
    const targetWeek = weekOf || this.getCurrentWeekStart();

    console.log(
      `📰 Looking for newsletter: week=${targetWeek.toISOString()}, categories=${categories.join(
        ","
      )}`
    );

    // Sort categories for consistent lookup
    const sortedCategories = [...categories].sort();

    // Try to find existing newsletter
    let newsletter = await prisma.newsletter.findFirst({
      where: {
        weekOf: targetWeek,
        categories: {
          equals: sortedCategories,
        },
      },
    });

    if (newsletter) {
      console.log(`✅ Found existing newsletter: ${newsletter.id}`);
      return {
        newsletter,
        articles: newsletter.articles,
        htmlContent: newsletter.htmlContent,
      };
    }

    console.log(
      `🔨 Creating new newsletter for categories: ${sortedCategories.join(
        ", "
      )}`
    );

    // Generate new newsletter content using the database-integrated method
    const result = await newsletterGenerator.generateNewsletterContentWithDB(
      categories,
      targetWeek.toISOString()
    );

    if (result.articles.length === 0) {
      throw new Error("Failed to generate newsletter articles");
    }

    console.log(
      `✅ Created newsletter: ${result.newsletter.id} with ${result.articles.length} articles`
    );

    return {
      newsletter: result.newsletter,
      articles: result.articles,
      htmlContent:
        result.newsletter.htmlContent ||
        generateNewsletterEmailHTML(result.articles, "Newsletter Subscriber"),
    };
  }

  /**
   * Get newsletter for a specific user (based on their categories)
   */
  async getUserNewsletter(userId: string, weekOf?: Date): Promise<any> {
    // Get user's categories
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const userCategories = user.categories.map((uc) => uc.category.name);

    if (userCategories.length === 0) {
      throw new Error("User has no selected categories");
    }

    // Get or create newsletter for user's categories
    return this.getOrCreateNewsletter(userCategories, weekOf);
  }

  /**
   * Mark newsletter as sent to a user
   */
  async markNewsletterSent(
    userId: string,
    newsletterId: string
  ): Promise<void> {
    await prisma.newsletterSent.upsert({
      where: {
        userId_newsletterId: {
          userId,
          newsletterId,
        },
      },
      update: {
        sentAt: new Date(),
      },
      create: {
        userId,
        newsletterId,
        sentAt: new Date(),
      },
    });
  }

  /**
   * Check if newsletter was already sent to user
   */
  async wasNewsletterSent(
    userId: string,
    newsletterId: string
  ): Promise<boolean> {
    const sent = await prisma.newsletterSent.findUnique({
      where: {
        userId_newsletterId: {
          userId,
          newsletterId,
        },
      },
    });
    return !!sent;
  }

  /**
   * Get all users who should receive a specific newsletter
   */
  async getUsersForNewsletter(categories: string[]): Promise<any[]> {
    return prisma.user.findMany({
      where: {
        categories: {
          some: {
            category: {
              name: {
                in: categories,
              },
            },
          },
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        newslettersSent: true,
      },
    });
  }

  /**
   * Get the start of the current week (Monday)
   */
  private getCurrentWeekStart(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday is start of week
    const monday = new Date(now.getTime() + diff * 24 * 60 * 60 * 1000);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  /**
   * Format category name for display
   */
  private formatCategoryName(category: string): string {
    const categoryMap: Record<string, string> = {
      artists: "Artists & Musicians",
      trends: "Cultural Trends",
      movies: "Movies & TV",
      books: "Books & Literature",
    };
    return categoryMap[category] || category;
  }

  /**
   * Get newsletter statistics
   */
  async getNewsletterStats(newsletterId: string) {
    const newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId },
      include: {
        sentTo: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!newsletter) {
      return null;
    }

    return {
      id: newsletter.id,
      title: newsletter.title,
      weekOf: newsletter.weekOf,
      categories: newsletter.categories,
      articlesCount: Array.isArray(newsletter.articles)
        ? newsletter.articles.length
        : 0,
      sentCount: newsletter.sentTo.length,
      createdAt: newsletter.createdAt,
    };
  }
}

export const newsletterService = new NewsletterService();
