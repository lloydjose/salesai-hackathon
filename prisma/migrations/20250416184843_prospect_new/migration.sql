/*
  Warnings:

  - You are about to drop the column `companyName` on the `prospect` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `prospect` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `prospect` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "prospect" DROP COLUMN "companyName",
DROP COLUMN "email",
DROP COLUMN "jobTitle";
