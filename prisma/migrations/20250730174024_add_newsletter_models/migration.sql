-- CreateTable
CREATE TABLE "public"."newsletters" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "weekOf" TIMESTAMP(3) NOT NULL,
    "categories" TEXT[],
    "articles" JSONB NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."newsletter_sent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "newsletterId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_sent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "newsletters_weekOf_categories_key" ON "public"."newsletters"("weekOf", "categories");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_sent_userId_newsletterId_key" ON "public"."newsletter_sent"("userId", "newsletterId");

-- AddForeignKey
ALTER TABLE "public"."newsletter_sent" ADD CONSTRAINT "newsletter_sent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."newsletter_sent" ADD CONSTRAINT "newsletter_sent_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "public"."newsletters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
