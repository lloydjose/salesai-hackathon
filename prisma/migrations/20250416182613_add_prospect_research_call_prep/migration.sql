-- CreateTable
CREATE TABLE "prospectResearch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "linkedinProfileUrl" TEXT,
    "linkedinData" JSONB,
    "aiAnalysis" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prospectResearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "callPrepBrief" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prospectResearchId" TEXT NOT NULL,
    "formInput" JSONB NOT NULL,
    "aiCallPrep" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "callPrepBrief_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "prospectResearch" ADD CONSTRAINT "prospectResearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "callPrepBrief" ADD CONSTRAINT "callPrepBrief_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "callPrepBrief" ADD CONSTRAINT "callPrepBrief_prospectResearchId_fkey" FOREIGN KEY ("prospectResearchId") REFERENCES "prospectResearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
