import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Query,
	UseGuards,
	Delete,
} from "@nestjs/common";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
	ApiQuery,
} from "@nestjs/swagger";
import { MetricsService } from "./metrics.service";
import { CreateMetricDto } from "./dto/create-metric.dto";
import { BulkUpdateMetricsDto } from "./dto/bulk-update-metrics.dto";
import { AnalyticsDto } from "./dto/analytics.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GetUser } from "../auth/get-user.decorator";
import { BulkMetricsAuthGuard } from "../auth/bulk-metrics-auth.guard";

@ApiTags("metrics")
@Controller("assistants/:assistantId/metrics")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MetricsController {
	constructor(private metricsService: MetricsService) {}

	@Post()
	@ApiOperation({ summary: "Log daily metrics for an assistant" })
	@ApiResponse({ status: 201, description: "Metrics logged successfully" })
	async create(
		@Param("assistantId") assistantId: string,
		@Body() createMetricDto: CreateMetricDto
	) {
		return this.metricsService.create(+assistantId, createMetricDto);
	}

	@Get()
	@ApiOperation({ summary: "Get metrics for an assistant" })
	@ApiQuery({
		name: "start",
		required: false,
		description: "Start date (YYYY-MM-DD)",
	})
	@ApiQuery({
		name: "end",
		required: false,
		description: "End date (YYYY-MM-DD)",
	})
	@ApiResponse({ status: 200, description: "Metrics retrieved successfully" })
	async findByAssistant(
		@Param("assistantId") assistantId: string,
		@Query("start") startDate?: string,
		@Query("end") endDate?: string
	) {
		return this.metricsService.findByAssistant(
			+assistantId,
			startDate,
			endDate
		);
	}

	@Get("rolling-avg")
	@ApiOperation({ summary: "Get rolling averages for an assistant" })
	@ApiQuery({
		name: "days",
		required: false,
		description: "Number of days for rolling average (default: 7)",
	})
	@ApiResponse({
		status: 200,
		description: "Rolling averages retrieved successfully",
	})
	async getRollingAverage(
		@Param("assistantId") assistantId: string,
		@Query("days") days?: string
	) {
		const dayCount = days ? parseInt(days, 10) : 7;
		return this.metricsService.getRollingAverage(+assistantId, dayCount);
	}

	@Get("aggregated")
	@ApiOperation({ summary: "Get aggregated metrics for an assistant" })
	@ApiResponse({
		status: 200,
		description: "Aggregated metrics retrieved successfully",
	})
	async getAggregatedMetrics(@Param("assistantId") assistantId: string) {
		return this.metricsService.getAggregatedMetrics(+assistantId);
	}

	@Get("daily-averages")
	@ApiOperation({ summary: "Get daily averages for an assistant" })
	@ApiQuery({
		name: "days",
		required: false,
		description: "Number of days to retrieve (default: 30)",
	})
	@ApiResponse({
		status: 200,
		description: "Daily averages retrieved successfully",
	})
	async getDailyAverages(
		@Param("assistantId") assistantId: string,
		@Query("days") days?: string
	) {
		const dayCount = days ? parseInt(days, 10) : 30;
		return this.metricsService.getDailyAverages(+assistantId, dayCount);
	}
}

@ApiTags("metrics")
@Controller("metrics")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MetricsAnalyticsController {
	constructor(private metricsService: MetricsService) {}

	@Get("analytics")
	@ApiOperation({ summary: "Get analytics data with flexible time range and assistant filtering" })
	@ApiQuery({
		name: "assistantId",
		required: false,
		description: "Assistant ID to filter metrics (if not provided, returns metrics for all user's assistants)",
	})
	@ApiQuery({
		name: "startDate",
		required: false,
		description: "Start date (YYYY-MM-DD)",
	})
	@ApiQuery({
		name: "endDate",
		required: false,
		description: "End date (YYYY-MM-DD)",
	})
	@ApiQuery({
		name: "timeRange",
		required: false,
		enum: ["daily", "weekly", "monthly", "yearly"],
		description: "Time range for analytics aggregation (default: daily)",
	})
	@ApiResponse({ status: 200, description: "Analytics data retrieved successfully" })
	async getAnalytics(
		@GetUser() user: any,
		@Query() analyticsDto: AnalyticsDto
	) {
		return this.metricsService.getAnalytics(user.id, analyticsDto);
	}
}

@ApiTags("metrics")
@Controller("metrics")
@UseGuards(BulkMetricsAuthGuard)
@ApiBearerAuth()
export class MetricsBulkController {
	constructor(private metricsService: MetricsService) {}

	@Post("bulk-update")
	@ApiOperation({ summary: "Bulk update metrics from VAPI data" })
	@ApiResponse({ status: 201, description: "Metrics bulk updated successfully" })
	async bulkUpdate(@Body() bulkUpdateDto: BulkUpdateMetricsDto) {
		return this.metricsService.bulkUpdate(
			bulkUpdateDto.updateAll || false,
			bulkUpdateDto.metrics
		);
	}
}
