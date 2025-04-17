/*
  Warnings:

  - You are about to drop the column `prospectResearchId` on the `callPrepBrief` table. All the data in the column will be lost.
  - You are about to drop the `prospectResearch` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `prospectId` to the `callPrepBrief` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProspectSource" AS ENUM ('MANUAL', 'LINKEDIN', 'CRM', 'OTHER');

-- DropForeignKey
ALTER TABLE "callPrepBrief" DROP CONSTRAINT "callPrepBrief_prospectResearchId_fkey";

-- DropForeignKey
ALTER TABLE "prospectResearch" DROP CONSTRAINT "prospectResearch_userId_fkey";

-- AlterTable
ALTER TABLE "callPrepBrief" DROP COLUMN "prospectResearchId",
ADD COLUMN     "prospectId" TEXT NOT NULL;

-- DropTable
DROP TABLE "prospectResearch";

-- CreateTable
CREATE TABLE "prospect" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jobTitle" TEXT,
    "companyName" TEXT,
    "email" TEXT,
    "linkedinProfileUrl" TEXT,
    "customData" JSONB,
    "source" "ProspectSource" NOT NULL DEFAULT 'MANUAL',
    "linkedinData" JSONB,
    "aiAnalysis" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prospect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prospect_linkedinProfileUrl_key" ON "prospect"("linkedinProfileUrl");

-- AddForeignKey
ALTER TABLE "prospect" ADD CONSTRAINT "prospect_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "callPrepBrief" ADD CONSTRAINT "callPrepBrief_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
