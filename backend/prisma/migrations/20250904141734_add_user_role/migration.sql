/*
  Warnings:

  - The primary key for the `metrics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `metrics` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "metrics_assistantId_date_key";

-- AlterTable
ALTER TABLE "metrics" DROP CONSTRAINT "metrics_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "metrics_pkey" PRIMARY KEY ("assistantId", "date");

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'customer';

-- CreateIndex
CREATE INDEX "metrics_date_idx" ON "metrics"("date");
