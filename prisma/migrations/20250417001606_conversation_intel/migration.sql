-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETE', 'FAILED');

-- CreateTable
CREATE TABLE "conversation_analysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "description" TEXT,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "transcript" JSONB,
    "aiAnalysis" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "conversation_analysis_userId_idx" ON "conversation_analysis"("userId");

-- AddForeignKey
ALTER TABLE "conversation_analysis" ADD CONSTRAINT "conversation_analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
