import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "artists",
    label: "Artists & Musicians",
    description: "Latest trends in music and artist insights",
    icon: "🎵",
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "trends",
    label: "Cultural Trends",
    description: "Emerging trends in entertainment and culture",
    icon: "📈",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "movies",
    label: "Movies & TV",
    description: "Film and television recommendations",
    icon: "🎬",
    color: "from-purple-500 to-violet-500",
  },
  {
    name: "books",
    label: "Books & Literature",
    description: "Literary trends and book recommendations",
    icon: "📚",
    color: "from-red-500 to-orange-500",
  },
];

async function main() {
  console.log("🌱 Seeding categories...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log("✅ Categories seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
