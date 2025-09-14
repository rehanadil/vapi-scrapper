-- Add new failed call count columns
ALTER TABLE "metrics" ADD COLUMN "failedCustomerEndedCallCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "metrics" ADD COLUMN "failedAssistantEndedCallCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "metrics" ADD COLUMN "failedCustomerNoAnswerCallCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "metrics" ADD COLUMN "failedExceedDurationCallCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "metrics" ADD COLUMN "failedCustomerBusyCallCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "metrics" ADD COLUMN "failedSilenceTimeoutCallCount" INTEGER NOT NULL DEFAULT 0;

-- Remove the old failedCallCount column
ALTER TABLE "metrics" DROP COLUMN "failedCallCount";