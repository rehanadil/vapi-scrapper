import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { MetricsService } from "./metrics.service";
import { MetricsController, MetricsBulkController, MetricsAnalyticsController } from "./metrics.controller";

@Module({
	imports: [PrismaModule],
	controllers: [MetricsController, MetricsBulkController, MetricsAnalyticsController],
	providers: [MetricsService],
	exports: [MetricsService],
})
export class MetricsModule {}
