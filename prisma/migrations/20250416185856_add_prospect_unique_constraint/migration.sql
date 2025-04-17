/*
  Warnings:

  - A unique constraint covering the columns `[userId,linkedinProfileUrl]` on the table `prospect` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "prospect_userId_linkedinProfileUrl_key" ON "prospect"("userId", "linkedinProfileUrl");
