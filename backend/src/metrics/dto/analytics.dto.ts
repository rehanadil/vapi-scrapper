import { IsOptional, IsString, IsEnum, IsDateString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export enum TimeRange {
	DAILY = 'daily',
	WEEKLY = 'weekly',
	MONTHLY = 'monthly',
	YEARLY = 'yearly'
}

export class AnalyticsDto {
	@ApiPropertyOptional({ description: "Assistant ID to filter metrics" })
	@IsOptional()
	@IsString()
	assistantId?: string;

	@ApiPropertyOptional({ description: "Start date (YYYY-MM-DD)" })
	@IsOptional()
	@IsDateString()
	startDate?: string;

	@ApiPropertyOptional({ description: "End date (YYYY-MM-DD)" })
	@IsOptional()
	@IsDateString()
	endDate?: string;

	@ApiPropertyOptional({
		enum: TimeRange,
		default: TimeRange.DAILY,
		description: "Time range for analytics aggregation"
	})
	@IsOptional()
	@IsEnum(TimeRange)
	timeRange?: TimeRange = TimeRange.DAILY;
}