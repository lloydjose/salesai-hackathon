/*
  Warnings:

  - You are about to drop the column `callStatus` on the `callSimulation` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `callSimulation` table. All the data in the column will be lost.
  - You are about to drop the column `fillerWordCount` on the `callSimulation` table. All the data in the column will be lost.
  - You are about to drop the column `keyMoments` on the `callSimulation` table. All the data in the column will be lost.
  - You are about to drop the column `paceWPM` on the `callSimulation` table. All the data in the column will be lost.
  - You are about to drop the column `scorecard` on the `callSimulation` table. All the data in the column will be lost.
  - You are about to drop the column `talkRatio` on the `callSimulation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "callSimulation" DROP COLUMN "callStatus",
DROP COLUMN "completedAt",
DROP COLUMN "fillerWordCount",
DROP COLUMN "keyMoments",
DROP COLUMN "paceWPM",
DROP COLUMN "scorecard",
DROP COLUMN "talkRatio";
