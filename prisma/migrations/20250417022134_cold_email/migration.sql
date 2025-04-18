-- CreateTable
CREATE TABLE "cold_email" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prospectId" TEXT,
    "userInput" JSONB NOT NULL,
    "aiGeneratedEmail" JSONB,
    "editedContent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cold_email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cold_email_userId_idx" ON "cold_email"("userId");

-- CreateIndex
CREATE INDEX "cold_email_prospectId_idx" ON "cold_email"("prospectId");

-- AddForeignKey
ALTER TABLE "cold_email" ADD CONSTRAINT "cold_email_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cold_email" ADD CONSTRAINT "cold_email_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
