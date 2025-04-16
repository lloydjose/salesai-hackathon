/*
  Warnings:

  - Added the required column `callStatus` to the `callSimulation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "callSimulation" ADD COLUMN     "callStatus" TEXT NOT NULL;
