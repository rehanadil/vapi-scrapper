import { IsNumber, IsDateString, Min, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMetricDto {
	@ApiProperty()
	@IsDateString()
	date: string;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	totalCallDuration?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	outboundCallCount?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	webCallCount?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	failedCustomerEndedCallCount?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	failedAssistantEndedCallCount?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	failedCustomerNoAnswerCallCount?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	failedExceedDurationCallCount?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	failedCustomerBusyCallCount?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	failedSilenceTimeoutCallCount?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	failedOtherCallCount?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	totalMinutes?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	avgCallCost?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	totalCost?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	totalSpent?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	successEvaluationTrue?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	successEvaluationFalse?: number;

	@ApiProperty({ required: false })
	@IsNumber()
	@Min(0)
	@IsOptional()
	successEvaluationNull?: number;
}
