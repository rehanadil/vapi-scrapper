/*
  Warnings:

  - You are about to drop the column `callCount` on the `metrics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "metrics" 
DROP COLUMN "callCount",
ADD COLUMN "totalCallDuration" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "outboundCallCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "webCallCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "failedCallCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "successEvaluationTrue" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "successEvaluationFalse" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "successEvaluationNull" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "totalMinutes" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "avgCallCost" SET DEFAULT 0,
ALTER COLUMN "totalCost" SET DEFAULT 0;